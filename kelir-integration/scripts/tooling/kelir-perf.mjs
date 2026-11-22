// kelir-perf.mjs - Next.js (App Router) performance audit (issue #123).
// Optional dev tooling, no deps.
//
//   node src/views/kelir/kelir-integration/scripts/tooling/kelir-perf.mjs [--root <dir>] [--ignore <s>]...
//                                                 [--strict] [--json]
//
// Static, dependency-free checks that flag patterns which make a Next.js app
// slower than it needs to be. Project-agnostic: run it from any project root
// (or pass --root). No knowledge of Kelir or any app internals.
//
//   WARN  root-layout-dynamic   root app/layout reads cookies()/headers()/session
//                               -> every route becomes dynamic (no SSG/CDN)
//   WARN  dns-lookup-no-cache   dns.lookup / node:dns used without a cache/memo
//                               -> network call per request on the hot path
//   WARN  img-no-dimensions     raw <img> without width+height (or fill) -> CLS
//   WARN  external-font-blocking <link>/@import to a remote font without preconnect
//   WARN  inline-list-map       rows/items/data={arr.map(...)} builds the full
//                               list inline (consider the visible page only)
//
// Escape hatch (shared with the six gates, issue #110/#114): a line carrying
// `kelir-allow: <reason>` (or up to 2 lines above it) downgrades its finding to
// ALLOW; a reason is required and ALLOW never fails --strict.
//
//   --root <dir>    project root (default: current working directory)
//   --ignore <s>    skip files/dirs whose path contains this (repeatable)
//
// Exit: 1 on any ERROR (and on WARN with --strict), 2 on bad usage.
// No dependencies.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { allowReasonNear, printReport } from "../kelir-report.mjs";
import { TOOLS_VERSION } from "../kelir-version.mjs";

// --- args -------------------------------------------------------------------

function takeValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i < 0 || i + 1 >= process.argv) return null;
  return process.argv[i + 1];
}

const STRICT = process.argv.includes("--strict");
const JSON_OUT = process.argv.includes("--json");
const ROOT = takeValue("--root") ?? process.cwd();
const IGNORE = process.argv.reduce((acc, arg, i) => {
  if (arg === "--ignore" && process.argv[i + 1]) acc.push(process.argv[i + 1]);
  return acc;
}, []);

// Source dir: prefer <root>/src (Next default), else the root itself.
const SRC = existsSync(join(ROOT, "src")) ? join(ROOT, "src") : ROOT;

if (!existsSync(SRC)) {
  console.error(
    `kelir-perf: cannot find a source directory under ${ROOT}.\n` +
      "  Run this from the project root or pass --root <dir>.",
  );
  process.exit(2);
}

const rel = (p) => relative(ROOT, p).split(sep).join("/");
const lineOf = (text, idx) => text.slice(0, idx).split(/\r?\n/).length;

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const full = join(dir, name);
    if (IGNORE.some((s) => rel(full).includes(s) || name === s)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(?:ts|tsx|mts|cts|js|jsx)$/.test(name)) out.push(full);
  }
  return out;
}

// --- scanning helpers -------------------------------------------------------

// Read a JSX/TS tag starting at the "<" at `lt`; return its tag name, the raw
// attribute text, and the index of the closing ">" (quote/brace aware).
function readTag(text, lt) {
  let i = lt + 1;
  let name = "";
  while (i < text.length && /[A-Za-z0-9]/.test(text[i])) {
    name += text[i];
    i += 1;
  }
  let brace = 0;
  let quote = "";
  let attrs = "";
  while (i < text.length) {
    const c = text[i];
    if (quote) {
      attrs += c;
      if (c === "\\") {
        attrs += text[i + 1] ?? "";
        i += 2;
        continue;
      }
      if (c === quote) quote = "";
      i += 1;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      attrs += c;
      i += 1;
      continue;
    }
    if (c === "{") {
      brace += 1;
      attrs += c;
      i += 1;
      continue;
    }
    if (c === "}") {
      brace -= 1;
      attrs += c;
      i += 1;
      continue;
    }
    if (brace === 0 && (c === ">" || c === "<")) return { name, attrs, end: i };
    attrs += c;
    i += 1;
  }
  return { name, attrs, end: text.length };
}

function tagsNamed(text, name) {
  const out = [];
  const re = new RegExp(`<${name}\\b`, "g");
  let m;
  while ((m = re.exec(text))) {
    const tag = readTag(text, m.index);
    out.push({ index: m.index, attrs: tag.attrs });
  }
  return out;
}

// --- analysis ---------------------------------------------------------------

const files = walk(SRC);
const rows = [];
const metrics = { files: files.length, tsx: 0, tags: 0, dns: 0 };

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

// 1) Root layout reads per-request data -> all routes dynamic.
const layoutCandidates = [
  join(SRC, "app", "layout.tsx"),
  join(SRC, "app", "layout.ts"),
  join(SRC, "app", "layout.jsx"),
  join(SRC, "app", "layout.js"),
  join(ROOT, "app", "layout.tsx"),
];
for (const candidate of layoutCandidates) {
  if (!existsSync(candidate)) continue;
  const text = readFileSync(candidate, "utf8");
  const re = /\b(?:cookies|headers|draftMode|connection|getServerSession)\s*\(/g;
  let m;
  while ((m = re.exec(text))) {
    push(
      candidate,
      text,
      m.index,
      "WARN",
      "root-layout-dynamic",
      `root layout calls ${m[0].replace(/\s*\($/, "()")}, forcing every route dynamic`,
      "move cookies()/headers()/session reads into route-group layouts so public routes can be static",
    );
  }
}

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const isTsx = /\.tsx$/.test(file);
  if (isTsx) metrics.tsx += 1;

  // 2) DNS lookups without a cache on a hot path.
  if (/\bdns\.promises\b|\bdns\.lookup\b|from\s+["']node:dns|require\(["']dns/.test(text)) {
    metrics.dns += 1;
    const hasCache = /\bcache\w*\b|\bmemo\w*\b|\bttl\b|\bTTL\b|new Map\s*[(<]/i.test(
      text,
    );
    if (!hasCache) {
      const m = /\bdns\.lookup\b|\bdns\.promises\b|node:dns/.exec(text);
      push(
        file,
        text,
        m ? m.index : 0,
        "WARN",
        "dns-lookup-no-cache",
        "DNS lookup with no cache/memo/TTL (network call per request)",
        "cache results per host with a TTL, or validate once at write time instead of on every request",
      );
    }
  }

  // 3) Raw <img> without intrinsic dimensions -> layout shift.
  for (const tag of tagsNamed(text, "img")) {
    metrics.tags += 1;
    const hasWidth = /width\s*=/.test(tag.attrs);
    const hasHeight = /height\s*=/.test(tag.attrs);
    const hasFill = /\bfill\b/.test(tag.attrs);
    if (!((hasWidth && hasHeight) || hasFill)) {
      push(
        file,
        text,
        tag.index,
        "WARN",
        "img-no-dimensions",
        "<img> without width+height (or fill)",
        "set width/height (or use next/image with fill) to reserve space and avoid CLS",
      );
    }
  }

  // 4) Remote font loaded render-blocking without preconnect.
  if (isTsx || /\.css$/.test(file)) {
    const fontRef = /fonts\.(?:googleapis|gstatic)\.com|cdnfonts\.com|fonts\.cdnfonts\.com/.exec(
      text,
    );
    if (fontRef && !/preconnect/i.test(text)) {
      const host = /cdnfonts\.com/.test(fontRef[0])
        ? "fonts.cdnfonts.com"
        : "fonts.gstatic.com";
      push(
        file,
        text,
        fontRef.index,
        "WARN",
        "external-font-blocking",
        "remote font referenced without preconnect (render-blocking third-party request)",
        `self-host via next/font (display:"swap"), or add <link rel="preconnect" href="https://${host}">`,
      );
    }
  }

  // 5) Full list built inline then handed to a list/table (consider page only).
  if (isTsx) {
    const re = /\b(?:rows|items|data|list)\s*=\s*\{[^}]*\.map\s*\(/g;
    let m;
    while ((m = re.exec(text))) {
      push(
        file,
        text,
        m.index,
        "WARN",
        "inline-list-map",
        "full array .map() built inline into a list prop",
        "transform only the visible page (or virtualize) instead of building every row each render",
      );
    }
  }
}

// --- report -----------------------------------------------------------------

const errors = rows.filter((r) => r.level === "ERROR").length;
const warns = rows.filter((r) => r.level === "WARN").length;
const allows = rows.filter((r) => r.level === "ALLOW").length;
const failed = errors > 0 || (STRICT && warns > 0);

const scope = {
  "files scanned": metrics.files,
  "tsx files": metrics.tsx,
  "raw <img>": metrics.tags,
  "dns files": metrics.dns,
};

if (JSON_OUT) {
  console.log(
    JSON.stringify({ counts: { errors, warns, allows }, rows, scope }, null, 2),
  );
} else {
  rows.sort((a, b) => (a.level === b.level ? 0 : a.level === "ERROR" ? -1 : 1));
  printReport({
    gate: "kelir-perf",
    version: TOOLS_VERSION,
    status: failed ? "FAIL" : "OK",
    counts: { error: errors, warn: warns, allow: allows },
    rows,
    emptyText: "(no performance issues detected)",
    scope,
  });
}

process.exit(failed ? 1 : 0);