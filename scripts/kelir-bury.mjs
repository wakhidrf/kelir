// kelir-bury.mjs - dead-code gate (issue #110, #114).
//
//   node src/views/kelir/scripts/kelir-bury.mjs [--tsc]
//
//   --tsc  also run `tsc --noUnusedLocals --noUnusedParameters`
//
// Detects:
//   A. Dead files   - unreachable from a Next.js entry point.
//   B. Dead exports - only referenced at their declaration.
//   C. Dead logic   - constant conditions and identical ternary branches.
//   D. (--tsc)      - unused variables/imports/parameters.
//
// Escape hatch (issue #114): mark an intentional exception with
// `kelir-allow: <reason>` on the flagged line or up to 2 lines above it. The
// marker is shared by the gate scripts (same model as kelir-slop); a reason is
// required. Allowed findings are reported as ALLOW (never silent) and do not
// fail --strict.
//
// The kit at src/views/kelir is still part of the consumer graph (imported by
// app modules), but it is not reported as a candidate. Heuristics can produce
// false positives: verify manually before deleting.
//
// No dependencies. Exits 1 when a finding is present.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { TOOLS_VERSION } from "./kelir-version.mjs";
import { matchAllowReason, printReport } from "./kelir-report.mjs";

// scripts/ -> kelir/ -> views/ -> src/ -> <project>
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KIT = join(SRC, "views", "kelir");
const GENERATED = new Set([join(SRC, "views", "kelir-docs.ts")]);
const RUN_TSC = process.argv.includes("--tsc");

const ENTRY_RE =
  /^(?:page|layout|route|loading|error|global-error|not-found|template|default|proxy|middleware|instrumentation|robots|sitemap|manifest|icon|apple-icon|opengraph-image|twitter-image|favicon)\.(?:ts|tsx|js|jsx|mjs|mts)$/;
const TEST_RE = /\.(?:test|spec)\.(?:ts|tsx|js|jsx|mjs|mts)$/;
const NON_APP_RE = /\.(?:d\.ts|setup\.ts|config\.ts)$/;
const SOURCE_RE = /\.(?:ts|tsx|mts|js|jsx|mjs)$/;

// Next.js-specific exports (route handlers, metadata) are not dead code.
const NEXT_SPECIAL = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
  "runtime",
  "dynamic",
  "revalidate",
  "fetchCache",
  "preferredRegion",
  "maxDuration",
  "generateStaticParams",
  "metadata",
  "generateMetadata",
  "viewport",
  "generateViewport",
  "contentType",
  "alt",
  "size",
  "config",
]);

if (!existsSync(SRC)) {
  console.error(
    "kelir-bury: cannot find <project>/src at " +
      `${SRC}.\n` +
      "  Run this from a consumer project that uses Kelir.",
  );
  process.exit(2);
}

const rel = (p) => relative(ROOT, p).split(sep).join("/");
const lineOf = (src, index) => src.slice(0, index).split("\n").length;
const inKit = (p) => p === KIT || p.startsWith(KIT + sep);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (SOURCE_RE.test(name)) out.push(full);
  }
  return out;
}

const allFiles = walk(SRC);
const graphFiles = allFiles.filter(
  (file) => !TEST_RE.test(file) && !NON_APP_RE.test(file) && !GENERATED.has(file),
);
const byPath = new Set(graphFiles);
const sources = new Map(allFiles.map((file) => [file, readFileSync(file, "utf8")]));
const sourceLines = new Map(
  [...sources].map(([file, src]) => [file, src.split(/\r?\n/)]),
);

// kelir-allow: <reason> on the flagged line or up to 2 lines above it. The
// marker is generic across the gate scripts (no script name); parsing lives in
// kelir-report.mjs so CRLF checkouts keep working (issue #118). `found` stays
// true for an empty reason so it can be reported as "requires a reason".
function allowFor(file, line) {
  const lines = sourceLines.get(file);
  if (!lines) return { found: false, reason: "" };
  for (let i = line; i >= Math.max(1, line - 2); i--) {
    const hit = matchAllowReason(lines[i - 1]);
    if (hit.found) return hit;
  }
  return { found: false, reason: "" };
}

function tryResolve(base) {
  const noExt = base.replace(SOURCE_RE, "");
  const candidates = [
    noExt,
    `${noExt}.ts`,
    `${noExt}.tsx`,
    `${noExt}.mts`,
    `${noExt}.js`,
    `${noExt}.jsx`,
    `${noExt}.mjs`,
    join(noExt, "index.ts"),
    join(noExt, "index.tsx"),
  ];
  return candidates.find((candidate) => byPath.has(candidate)) ?? null;
}

const specRe =
  /(?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)(["'])([^"']+)\1/g;

function importsOf(file) {
  const out = [];
  for (const match of sources.get(file).matchAll(specRe)) {
    const spec = match[2];
    let target = null;
    if (spec.startsWith("@/")) target = tryResolve(join(SRC, spec.slice(2)));
    else if (spec.startsWith("./") || spec.startsWith("../")) {
      target = tryResolve(resolve(dirname(file), spec));
    }
    if (target) out.push(target);
  }
  return out;
}

const isEntry = (file) => ENTRY_RE.test(basename(file));
const reachable = new Set();
const queue = graphFiles.filter((file) => isEntry(file));
while (queue.length > 0) {
  const file = queue.pop();
  if (reachable.has(file)) continue;
  reachable.add(file);
  for (const target of importsOf(file)) {
    if (!reachable.has(target)) queue.push(target);
  }
}

const deadFiles = graphFiles.filter(
  (file) => !inKit(file) && !isEntry(file) && !reachable.has(file),
);
const deadSet = new Set(deadFiles);

const allContent = allFiles.map((file) => sources.get(file)).join("\n");
const exportRe =
  /export\s+(?:async\s+)?(?:function\s*\*?|const|let|class)\s+([A-Za-z0-9_]+)/g;
const seenExports = new Set();
const deadExports = [];
for (const file of graphFiles) {
  if (inKit(file) || GENERATED.has(file) || deadSet.has(file)) continue;
  const source = sources.get(file);
  for (const match of source.matchAll(exportRe)) {
    const name = match[1];
    if (NEXT_SPECIAL.has(name) || seenExports.has(name)) continue;
    seenExports.add(name);
    const count = (allContent.match(new RegExp(`\\b${name}\\b`, "g")) ?? []).length;
    if (count <= 1) {
      deadExports.push({ file, line: lineOf(source, match.index), name });
    }
  }
}

const LOGIC_PATTERNS = [
  { re: /\bif\s*\(\s*(?:true|false)\s*\)/g, label: "constant if condition" },
  { re: /\bwhile\s*\(\s*(?:true|false)\s*\)/g, label: "constant while condition" },
  {
    re: /\?\s*([A-Za-z0-9_$.]+)\s*:\s*\1(?=\s*[,;)\]}])/g,
    label: "identical ternary branches",
  },
];
const deadLogic = [];
for (const file of graphFiles) {
  if (inKit(file) || GENERATED.has(file) || deadSet.has(file)) continue;
  const source = sources.get(file);
  for (const { re, label } of LOGIC_PATTERNS) {
    for (const match of source.matchAll(re)) {
      deadLogic.push({
        file,
        line: lineOf(source, match.index),
        label,
        text: match[0],
      });
    }
  }
}

let unused = [];
if (RUN_TSC) {
  const result = spawnSync(
    "npx",
    ["tsc", "--noEmit", "--noUnusedLocals", "--noUnusedParameters"],
    { encoding: "utf8", shell: process.platform === "win32" },
  );
  unused = (result.stdout ?? "")
    .split(/\r?\n/)
    .filter((line) => /is declared but|never read/.test(line) && !/kelir/.test(line));
}

const rows = [];
let allowedTotal = 0;

function push(item, rule, message, suggestion) {
  const a = item.file
    ? allowFor(item.file, item.line)
    : { found: false, reason: "" };
  if (a.found && a.reason) {
    allowedTotal++;
    rows.push({
      level: "ALLOW",
      location: item.location,
      rule,
      message,
      suggestion: a.reason,
    });
    return;
  }
  rows.push({
    level: "ERROR",
    location: item.location,
    rule,
    message:
      a.found && !a.reason
        ? `${message} [kelir-allow: requires a reason]`
        : message,
    suggestion,
  });
}

for (const file of deadFiles)
  push(
    { file, line: 1, location: rel(file) },
    "dead-file",
    "unreachable from an entry point",
    "remove or wire it",
  );
for (const e of deadExports)
  push(
    { file: e.file, line: e.line, location: `${rel(e.file)}:${e.line}` },
    "dead-export",
    `export '${e.name}' is only referenced at its declaration`,
    "remove or export it",
  );
for (const l of deadLogic)
  push(
    { file: l.file, line: l.line, location: `${rel(l.file)}:${l.line}` },
    "dead-logic",
    `${l.label} -> ${l.text}`,
    "remove the dead branch",
  );
if (RUN_TSC)
  for (const u of unused)
    rows.push({
      level: "ERROR",
      location: "tsc",
      rule: "unused",
      message: u.trim(),
      suggestion: "remove or use it",
    });

const errors = rows.filter((r) => r.level === "ERROR").length;

printReport({
  gate: "kelir-bury",
  version: TOOLS_VERSION,
  status: errors > 0 ? "FAIL" : "OK",
  counts: { error: errors, warn: 0, allow: allowedTotal },
  rows,
  emptyText: "(no dead code or logic detected)",
  scope: { "files scanned": allFiles.length, "graph files": graphFiles.length },
});
if (errors > 0) process.exit(1);
