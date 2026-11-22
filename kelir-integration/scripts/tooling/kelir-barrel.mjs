// kelir-barrel.mjs - barrel-file gate (barrel elimination).
//
//   node src/views/kelir/kelir-integration/scripts/tooling/kelir-barrel.mjs [--strict]
//
// A barrel is a file whose only job is to re-export from other modules:
//   - index.ts / index.tsx / index.mts / index.cts  (barrel by name), or
//   - any file made only of `export ... from` / `export { ... }` re-exports
//     (barrel by content), with no declarations, logic, or JSX.
//
// Barrels are banned in Kelir (AGENTS.md): import directly from the specific
// file so the dependency graph stays explicit and tree-shaking works. This gate
// keeps barrels from reappearing; when one is found, delete it and rewrite the
// imports to point at the concrete file each symbol came from.
//
// Scope: ALL of <project>/src, INCLUDING the kit at src/views/kelir. The kit is
// real code in this repo and must stay barrel-free too (the consolidation
// removed its barrels; this gate is the regression guard). No kit exclusion.
//
// Escape hatch: `kelir-allow: <reason>` in the first 3 lines exempts a file
// (reported as ALLOW, never silent). A reason is required.
//
// No dependencies. Exits 1 when a barrel is found (with --strict).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllowReason, printReport } from "../kelir-report.mjs";
import { TOOLS_VERSION } from "../kelir-version.mjs";

// tooling/ -> scripts/ -> kelir-integration/ -> kelir/ -> views/ -> src/ -> <project>
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KELIR = join(SRC, "views", "kelir");
const STRICT = process.argv.includes("--strict");

const EXT_RE = /\.(?:ts|tsx|mts|cts)$/;
const DECLARATION_RE = /\.d\.(?:ts|mts|cts)$/;
const TEST_RE = /\.(?:test|spec|test-d)\.(?:ts|tsx|mts|cts)$/;
const INDEX_RE = /^index\.(?:ts|tsx|mts|cts)$/;
// Generated / vendored: not ours to edit.
const GENERATED = [
  join(KELIR, "kelir-integration", "antislop"), // upstream mirror (do not touch)
  join(SRC, "views", "kelir-docs.ts"), // generated from README/CHANGELOG
];

if (!existsSync(SRC)) {
  console.error(
    "kelir-barrel: cannot find <project>/src at " +
      `${SRC}.\n` +
      "  Run this from the project root (or a consumer that places the kit at src/views/kelir).",
  );
  process.exit(2);
}

const rel = (p) => relative(ROOT, p).split(sep).join("/");

// Blank comments so commented-out exports are ignored; strings are preserved
// because the import specifier lives inside a string.
function blankComments(src) {
  const out = src.split("");
  let i = 0;
  let state = "code";
  while (i < src.length) {
    const c = src[i];
    const two = src.slice(i, i + 2);
    if (state === "code") {
      if (two === "//") {
        out[i] = " ";
        out[i + 1] = " ";
        state = "line";
        i += 2;
        continue;
      }
      if (two === "/*") {
        out[i] = " ";
        out[i + 1] = " ";
        state = "block";
        i += 2;
        continue;
      }
      if (c === "'") state = "sq";
      else if (c === '"') state = "dq";
      else if (c === "`") state = "tpl";
      i++;
      continue;
    }
    if (state === "line") {
      if (c === "\n") state = "code";
      else out[i] = " ";
      i++;
      continue;
    }
    if (state === "block") {
      if (two === "*/") {
        out[i] = " ";
        out[i + 1] = " ";
        state = "code";
        i += 2;
      } else {
        if (c !== "\n") out[i] = " ";
        i++;
      }
      continue;
    }
    if (c === "\\") {
      i += 2;
      continue;
    }
    const quote = state === "sq" ? "'" : state === "dq" ? '"' : "`";
    if (c === quote) state = "code";
    i++;
  }
  return out.join("");
}

// export ... from "..." (export * / export * as ns / export { ... } / export type { ... })
const RE_EXPORT_RE =
  /export\s+(?:type\s+)?(?:\*(?:\s+as\s+[A-Za-z0-9_$]+)?|\{[\s\S]*?\})\s*from\s*["'][^"']+["']\s*;?/g;
// export { ... } / export type { ... } (bare re-export of imported names)
const BARE_EXPORT_RE = /export\s+(?:type\s+)?\{[\s\S]*?\}\s*;?/g;
// import ... from "..." (multi-line) and side-effect import "..."
const IMPORT_RE = /import\s+[\s\S]*?\s+from\s*["'][^"']+["']\s*;?/g;
const IMPORT_SIDE_EFFECT_RE = /import\s*["'][^"']+["']\s*;?/g;

// True when the file is ONLY re-exports (no declarations, no logic, no JSX).
// Conservative: a file must contain at least one re-export and nothing else
// once re-exports, bare re-exports, and imports are stripped.
function isPureReExport(src) {
  let s = blankComments(src);
  if (!/\bexport\b/.test(s)) return false;
  let count = 0;
  s = s.replace(RE_EXPORT_RE, () => {
    count++;
    return "";
  });
  s = s.replace(BARE_EXPORT_RE, () => {
    count++;
    return "";
  });
  if (count === 0) return false;
  s = s.replace(IMPORT_RE, "").replace(IMPORT_SIDE_EFFECT_RE, "");
  return s.replace(/;/g, "").trim() === "";
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (EXT_RE.test(name) && !DECLARATION_RE.test(name)) out.push(full);
  }
  return out;
}

// kelir-allow: <reason> in the first 3 lines exempts a file (reported as ALLOW).
function allowReason(file) {
  const head = readFileSync(file, "utf8").split(/\r?\n/).slice(0, 3);
  for (const ln of head) {
    const reason = parseAllowReason(ln);
    if (reason) return reason;
  }
  return null;
}

const files = walk(SRC).filter(
  (f) => !TEST_RE.test(f) && !GENERATED.some((g) => f.startsWith(g)),
);

const findings = [];
for (const file of files) {
  const base = file.slice(file.lastIndexOf(sep) + 1);
  let rule = null;
  if (INDEX_RE.test(base)) {
    rule = "barrel-file"; // index.* by name (banned outright)
  } else if (isPureReExport(readFileSync(file, "utf8"))) {
    rule = "barrel-reexport"; // any file made only of re-exports
  }
  if (rule) findings.push({ file, rule, reason: allowReason(file) });
}

const errors = findings.filter((f) => !f.reason);
const allowed = findings.filter((f) => f.reason);

printReport({
  gate: "kelir-barrel",
  version: TOOLS_VERSION,
  status: errors.length > 0 ? "FAIL" : "OK",
  counts: { error: errors.length, warn: 0, allow: allowed.length },
  rows: [
    ...allowed.map((f) => ({
      level: "ALLOW",
      location: rel(f.file),
      rule: f.rule,
      message: f.rule === "barrel-file" ? "index.* barrel by name" : "pure re-export barrel",
      suggestion: f.reason,
    })),
    ...errors.map((f) => ({
      level: "ERROR",
      location: rel(f.file),
      rule: f.rule,
      message: f.rule === "barrel-file" ? "index.* barrel by name" : "pure re-export barrel",
      suggestion: "delete it and import directly from the specific file (no barrel)",
    })),
  ],
  emptyText: "(no barrel files)",
  scope: { "files scanned": files.length, "barrels found": findings.length },
});
if (STRICT && errors.length > 0) process.exit(1);