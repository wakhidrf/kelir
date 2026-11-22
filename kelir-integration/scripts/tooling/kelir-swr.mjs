// kelir-swr.mjs - SWR usage audit (issue #123). Optional dev tooling, no deps.
//
//   node src/views/kelir/kelir-integration/scripts/tooling/kelir-swr.mjs [--root <dir>] [--ignore <s>]...
//                                                [--keys <file>] [--strict] [--json]
//
// Static checks that flag patterns which make SWR data stale, flicker, race,
// or refetch needlessly:
//
//   ERROR  always-null-key        useSWR(null | undefined | "") -> never fetches
//   ERROR  mutate-key-mismatch    mutate("literal") targets a key no useSWR reads
//   WARN   optimistic-no-rollback optimistic mutate (revalidate:false), no rollback
//   WARN   search-no-keep-previous search/pagination key without keepPreviousData
//   WARN   no-config              useSWR without a config object
//   WARN   focus-refetch          revalidateOnFocus:true -> refetch on every focus
//   WARN   search-no-debounce     dynamic search key with no debounce
//
// Escape hatch (shared with the six gates, issue #110/#114): a line carrying
// `kelir-allow: <reason>` (or up to 2 lines above it) downgrades its finding to
// ALLOW; a reason is required and ALLOW never fails --strict.
//
//   --root <dir>    project root (default: current working directory)
//   --ignore <s>    skip files/dirs whose path contains this (repeatable)
//   --keys <file>   file exporting `const <name> = { member: "literal" }` so
//                   `<name>.member` resolves for mutate-key-mismatch
//
// Exit: 1 on any ERROR (and on WARN with --strict), 2 on bad usage.
// No dependencies.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { isAbsolute, join, relative, sep } from "node:path";
import { allowReasonNear, printReport } from "../kelir-report.mjs";
import { TOOLS_VERSION } from "../kelir-version.mjs";

function takeValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i < 0 || i + 1 >= process.argv) return null;
  return process.argv[i + 1];
}

const ROOT = takeValue("--root") ?? process.cwd();
const STRICT = process.argv.includes("--strict");
const JSON_OUT = process.argv.includes("--json");
const IGNORE = process.argv.reduce((acc, arg, i) => {
  if (arg === "--ignore" && process.argv[i + 1]) acc.push(process.argv[i + 1]);
  return acc;
}, []);
const KEYS_FILE = takeValue("--keys");

// Source dir: prefer <root>/src (Next default), else the root itself.
const SRC = existsSync(join(ROOT, "src")) ? join(ROOT, "src") : ROOT;

if (!existsSync(SRC)) {
  console.error(
    `kelir-swr: cannot find a source directory under ${ROOT}.\n` +
      "  Run this from the project root or pass --root <dir>.",
  );
  process.exit(2);
}

const rel = (p) => relative(ROOT, p).split(sep).join("/");
const lineOf = (text, idx) => text.slice(0, idx).split(/\r?\n/).length;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const full = join(dir, name);
    if (IGNORE.some((s) => rel(full).includes(s) || name === s)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(?:ts|tsx|mts|cts)$/.test(name)) out.push(full);
  }
  return out;
}

// --- lightweight TS scanners (strings, comments, brackets, generics) ---------

function skipString(text, i) {
  const quote = text[i];
  i += 1;
  while (i < text.length) {
    const c = text[i];
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === quote) return i + 1;
    i += 1;
  }
  return i;
}

function skipLineComment(text, i) {
  const e = text.indexOf("\n", i);
  return e < 0 ? text.length : e;
}

function skipBlockComment(text, i) {
  const e = text.indexOf("*/", i + 2);
  return e < 0 ? text.length : e + 2;
}

const GENERIC_PREV = /[A-Za-z0-9_$>\])]/;
function prevNonSpace(text, i) {
  let j = i - 1;
  while (j >= 0 && /\s/.test(text[j])) j -= 1;
  return j >= 0 ? text[j] : "";
}

// Given the index of `name` (e.g. "useSWR"/"mutate"), return the index of the
// opening "(" of its call, or -1 when the identifier is not being called.
function findCallOpen(text, from) {
  let i = from;
  while (i < text.length) {
    const c = text[i];
    if (c === "/" && text[i + 1] === "/") {
      i = skipLineComment(text, i);
      continue;
    }
    if (c === "/" && text[i + 1] === "*") {
      i = skipBlockComment(text, i);
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(text, i);
      continue;
    }
    if (c === "<") {
      // skip a generic argument list: <...>
      let depth = 0;
      i += 1;
      while (i < text.length) {
        const d = text[i];
        if (d === '"' || d === "'" || d === "`") {
          i = skipString(text, i);
          continue;
        }
        if (d === "<") depth += 1;
        else if (d === ">") {
          depth -= 1;
          if (depth <= 0) {
            i += 1;
            break;
          }
        }
        i += 1;
      }
      continue;
    }
    if (c === "(") return i;
    if (";,)]}?:=.\n".includes(c)) return -1;
    i += 1;
  }
  return -1;
}

// Index of the ")" matching the "(" at openIdx (strings/comments aware).
function findMatchingParen(text, openIdx) {
  let depth = 0;
  let i = openIdx;
  while (i < text.length) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(text, i);
      continue;
    }
    if (c === "/" && text[i + 1] === "/") {
      i = skipLineComment(text, i);
      continue;
    }
    if (c === "/" && text[i + 1] === "*") {
      i = skipBlockComment(text, i);
      continue;
    }
    if (c === "(") depth += 1;
    else if (c === ")") {
      depth -= 1;
      if (depth === 0) return i;
    }
    i += 1;
  }
  return -1;
}

// Split the inside of a call on top-level commas (generics/brackets aware).
function splitArgs(text) {
  const parts = [];
  let depthP = 0;
  let depthB = 0;
  let depthC = 0;
  let depthA = 0;
  let start = 0;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(text, i);
      continue;
    }
    if (c === "/" && text[i + 1] === "/") {
      i = skipLineComment(text, i);
      continue;
    }
    if (c === "/" && text[i + 1] === "*") {
      i = skipBlockComment(text, i);
      continue;
    }
    if (c === "(") depthP += 1;
    else if (c === ")") depthP -= 1;
    else if (c === "[") depthB += 1;
    else if (c === "]") depthB -= 1;
    else if (c === "{") depthC += 1;
    else if (c === "}") depthC -= 1;
    else if (c === "<" && GENERIC_PREV.test(prevNonSpace(text, i))) depthA += 1;
    else if (c === ">" && depthA > 0) depthA -= 1;
    else if (
      c === "," &&
      depthP === 0 &&
      depthB === 0 &&
      depthC === 0 &&
      depthA === 0
    ) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
    i += 1;
  }
  parts.push(text.slice(start));
  return parts
    .map((p) => p.trim())
    .filter((p, idx) => !(idx === parts.length - 1 && p === ""));
}

// --- static cache-key registry (optional, --keys <file>) ---------------------

// Parse a file that exports `const <name> = { member: "literal", ... }`.
// Returns { name, map } where map holds only string-literal members (function
// members stay dynamic). Returns { name: null, map: empty } when disabled.
function parseCacheKeys(keysFile) {
  const map = new Map();
  if (!keysFile) return { name: null, map };
  const file = isAbsolute(keysFile) ? keysFile : join(ROOT, keysFile);
  if (!existsSync(file)) return { name: null, map };
  const source = readFileSync(file, "utf8");
  const decl = /(?:export\s+)?const\s+(\w+)\s*=\s*\{/.exec(source);
  const name = decl ? decl[1] : null;
  const re = /(\w+)\s*:\s*["'`]([^"'`]*)["'`]/g;
  let m;
  while ((m = re.exec(source))) map.set(m[1], m[2]);
  return { name, map };
}

const { name: KEYS_NAME, map: CACHE_KEYS } = parseCacheKeys(KEYS_FILE);
const KEYS_RE = KEYS_NAME ? new RegExp(`^${KEYS_NAME}\\.(\\w+)$`) : null;
const KEYS_PREFIX_RE = KEYS_NAME ? new RegExp(`^${KEYS_NAME}\\.`) : null;

// Classify a key expression.
//   { kind: "static", value } | { kind: "null" } | { kind: "dynamic", expr }
function classifyKey(expr) {
  const e = expr.trim();
  if (!e) return { kind: "null" };
  if (/^(null|undefined|false)$/.test(e)) return { kind: "null" };
  if (/^(["'`])[\s\S]*\1$/.test(e) && !e.includes("${")) {
    return { kind: "static", value: e.slice(1, -1) };
  }
  const member = KEYS_RE ? KEYS_RE.exec(e) : null;
  if (member) {
    return CACHE_KEYS.has(member[1])
      ? { kind: "static", value: CACHE_KEYS.get(member[1]), expr: e }
      : { kind: "dynamic", expr: e };
  }
  return { kind: "dynamic", expr: e };
}

// --- analysis ---------------------------------------------------------------

const files = walk(SRC);
const rows = [];
const keys = new Set();
const metrics = {
  files: files.length,
  swrCalls: 0,
  boundMutates: 0,
  globalMutates: 0,
  optimisticMutates: 0,
  keepPreviousData: 0,
  focusRefetch: 0,
};

function push(file, text, idx, level, rule, message, suggestion) {
  const reason = allowReasonNear(text.split(/\r?\n/), lineOf(text, idx));
  rows.push({
    level: reason ? "ALLOW" : level,
    location: `${rel(file)}:${lineOf(text, idx)}`,
    rule,
    message,
    suggestion: reason ?? suggestion,
  });
}

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const fileHasDebounce = /debounce/i.test(text);
  const fileHasSearch = /\b(?:search|query|keyword|filter|term)\b/i.test(text);

  // useSWR(...)
  const swrRe = /\buseSWR\b/g;
  let m;
  while ((m = swrRe.exec(text))) {
    const open = findCallOpen(text, m.index + 5);
    if (open < 0) continue;
    const close = findMatchingParen(text, open);
    if (close < 0) continue;
    metrics.swrCalls += 1;
    const args = splitArgs(text.slice(open + 1, close));
    const keyExpr = args[0] ?? "";
    const cfgExpr = args[2] ?? "";
    const key = classifyKey(keyExpr);

    if (key.kind === "null") {
      push(
        file,
        text,
        m.index,
        "ERROR",
        "always-null-key",
        "key is always null/undefined/empty",
        "SWR never fetches with a constant null key; use a conditional key or remove the hook",
      );
    }
    if (key.kind === "static" && key.value) keys.add(key.value);

    if (cfgExpr && /keepPreviousData\s*:\s*true/.test(cfgExpr)) {
      metrics.keepPreviousData += 1;
    }

    const isSearchKey = /(search|query|keyword|filter|term|sort|page)/i.test(
      keyExpr,
    );
    if (
      isSearchKey &&
      key.kind !== "static" &&
      !/keepPreviousData\s*:\s*true/.test(cfgExpr)
    ) {
      push(
        file,
        text,
        m.index,
        "WARN",
        "search-no-keep-previous",
        "search/pagination key without keepPreviousData:true",
        "add keepPreviousData: true to avoid empty flashes and refetches while typing",
      );
    }

    if (/revalidateOnFocus\s*:\s*true/.test(cfgExpr)) {
      metrics.focusRefetch += 1;
      push(
        file,
        text,
        m.index,
        "WARN",
        "focus-refetch",
        "revalidateOnFocus:true refetches on every window focus",
        "set revalidateOnFocus:false when mutations already revalidate (dedupe only throttles 60s)",
      );
    }

    if (key.kind === "dynamic" && fileHasSearch && !fileHasDebounce) {
      push(
        file,
        text,
        m.index,
        "WARN",
        "search-no-debounce",
        "dynamic search key without debounce refetches per keystroke",
        "debounce the query (e.g. useDebouncedValue) before using it in the key",
      );
    }

    if (!cfgExpr.trim() && key.kind !== "null") {
      push(
        file,
        text,
        m.index,
        "WARN",
        "no-config",
        "no SWR config object",
        "set revalidateOnMount/revalidateOnFocus explicitly (global default is revalidateOnMount:false)",
      );
    }
  }

  // mutate(...) / mutate<Type>(...)
  const mutRe = /\bmutate\b/g;
  while ((m = mutRe.exec(text))) {
    const open = findCallOpen(text, m.index + 6);
    if (open < 0) continue;
    const close = findMatchingParen(text, open);
    if (close < 0) continue;
    const args = splitArgs(text.slice(open + 1, close));
    const first = args[0] ?? "";
    const key = classifyKey(first);
    const isKeyForm =
      key.kind === "static" ||
      (KEYS_PREFIX_RE ? KEYS_PREFIX_RE.test(first.trim()) : false) ||
      /^(["'`])/.test(first.trim());

    const optimistic =
      (args.length >= 3 && args[2].trim() === "false") ||
      (isKeyForm && /revalidate\s*:\s*false/.test(args[2] ?? "")) ||
      (!isKeyForm && args.length >= 2 && args[1].trim() === "false");

    const fromAdmin = KEYS_PREFIX_RE
      ? KEYS_PREFIX_RE.test(first.trim())
      : false;
    if (isKeyForm) {
      metrics.globalMutates += 1;
      if (key.kind === "static" && key.value) {
        if (fromAdmin) {
          keys.add(key.value); // canonical registry: any adminCacheKeys.* is valid
        } else if (!keys.has(key.value)) {
          // keys set may still be growing; re-check after the full pass below.
          rows.push({
            level: "ERROR",
            location: `${rel(file)}:${lineOf(text, m.index)}`,
            rule: "mutate-key-mismatch",
            message: `mutate("${key.value}") matches no useSWR key`,
            suggestion:
              "mutating an unknown key does not refresh any list; align the key string",
            _pendingKey: key.value,
          });
        }
      }
    } else if (args.length > 0) {
      metrics.boundMutates += 1;
    }

    if (optimistic) {
      metrics.optimisticMutates += 1;
      const window = text
        .split(/\r?\n/)
        .slice(
          Math.max(0, lineOf(text, m.index) - 1),
          lineOf(text, m.index) + 16,
        )
        .join("\n");
      const hasRollback =
        /rollback|previous(Data|Value|State|Snapshot)?|\.catch\b|\bcatch\b/i.test(
          window,
        );
      if (!hasRollback) {
        push(
          file,
          text,
          m.index,
          "WARN",
          "optimistic-no-rollback",
          "optimistic mutate (revalidate:false) without rollback",
          "wrap in try/catch and restore previous data (or pass rollback) on error",
        );
      }
    }
  }
}

// Second pass: resolve mutate-key-mismatch now that all keys are known.
for (const row of rows) {
  if (row._pendingKey && keys.has(row._pendingKey)) {
    row.level = "ALLOW";
    row.suggestion = "key present (resolved after full scan)";
  }
  delete row._pendingKey;
}

const errors = rows.filter((r) => r.level === "ERROR").length;
const warns = rows.filter((r) => r.level === "WARN").length;
const allows = rows.filter((r) => r.level === "ALLOW").length;
const failed = errors > 0 || (STRICT && warns > 0);

const scope = {
  "files scanned": metrics.files,
  "useSWR calls": metrics.swrCalls,
  "distinct keys": keys.size,
  "bound mutate()": metrics.boundMutates,
  "global mutate(key)": metrics.globalMutates,
  "optimistic mutate": metrics.optimisticMutates,
  keepPreviousData: metrics.keepPreviousData,
  "focus refetch": metrics.focusRefetch,
};

if (JSON_OUT) {
  console.log(
    JSON.stringify({ counts: { errors, warns, allows }, rows, scope }, null, 2),
  );
} else {
  rows.sort((a, b) => (a.level === b.level ? 0 : a.level === "ERROR" ? -1 : 1));
  printReport({
    gate: "kelir-swr",
    version: TOOLS_VERSION,
    status: failed ? "FAIL" : "OK",
    counts: { error: errors, warn: warns, allow: allows },
    rows,
    emptyText: "(no SWR issues detected)",
    scope,
  });
}

process.exit(failed ? 1 : 0);