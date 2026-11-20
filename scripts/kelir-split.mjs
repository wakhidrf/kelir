// kelir-split.mjs - file-length gate (issue #110).
//
// Every TypeScript file under <project>/src is capped at 100 lines so each
// file keeps one responsibility. The vendored kit at src/views/kelir is scanned
// too.
//
// Usage:
//   node src/views/kelir/scripts/kelir-split.mjs [--max=100]
//
// No dependencies. Exits 1 when a file exceeds the limit.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllowReason, printReport } from "./kelir-report.mjs";
import { TOOLS_VERSION } from "./kelir-version.mjs";

// scripts/ -> kelir/ -> views/ -> src/ -> <project>
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..", "..");
const SRC = join(ROOT, "src");

const EXT_RE = /\.(?:ts|tsx|mts|cts)$/;
const maxArg = process.argv.find((arg) => arg.startsWith("--max="));
const MAX = maxArg ? Number(maxArg.slice("--max=".length)) : 100;

if (!existsSync(SRC)) {
  console.error(
    "kelir-split: cannot find <project>/src at " +
      `${SRC}.\n` +
      "  Run this from a consumer project that uses Kelir.",
  );
  process.exit(2);
}

if (!Number.isInteger(MAX) || MAX < 1) {
  console.error(`kelir-split: --max must be an integer > 0 (got '${maxArg}').`);
  process.exit(2);
}

const rel = (p) => relative(ROOT, p).split(sep).join("/");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (EXT_RE.test(name)) out.push(full);
  }
  return out;
}

function countLines(file) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  if (lines.length > 0 && lines.at(-1) === "") lines.pop();
  return lines.length;
}

const files = walk(SRC);
const violations = files
  .map((file) => ({ file, lines: countLines(file) }))
  .filter((entry) => entry.lines > MAX)
  .sort((a, b) => b.lines - a.lines);

// kelir-allow: <reason> in the first 3 lines exempts a file (reported as ALLOW).
// Parsing lives in kelir-report.mjs so CRLF checkouts keep working (issue #118).
function allowReason(file) {
  const head = readFileSync(file, "utf8").split(/\r?\n/).slice(0, 3);
  for (const ln of head) {
    const reason = parseAllowReason(ln);
    if (reason) return reason;
  }
  return null;
}

const withReason = violations.map((v) => ({ ...v, reason: allowReason(v.file) }));
const blocked = withReason.filter((v) => !v.reason);
const allowed = withReason.filter((v) => v.reason);

printReport({
  gate: "kelir-split",
  version: TOOLS_VERSION,
  status: blocked.length > 0 ? "FAIL" : "OK",
  counts: { error: blocked.length, warn: 0, allow: allowed.length },
  rows: [
    ...allowed.map(({ file, lines, reason }) => ({
      level: "ALLOW",
      location: rel(file),
      rule: "file-length",
      message: `${lines} lines (limit ${MAX})`,
      suggestion: reason,
    })),
    ...blocked.map(({ file, lines }) => ({
      level: "ERROR",
      location: rel(file),
      rule: "file-length",
      message: `${lines} lines (limit ${MAX})`,
      suggestion: "split by responsibility (do not raise the limit without a reason)",
    })),
  ],
  emptyText: `(all files are <= ${MAX} lines)`,
  scope: { "files scanned": files.length, "line limit": MAX },
});
if (blocked.length > 0) process.exit(1);
