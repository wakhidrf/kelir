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

if (violations.length > 0) {
  console.error(`kelir-split: ${violations.length} files exceed ${MAX} lines.`);
  for (const v of violations) {
    console.error(`  ${String(v.lines).padStart(4)}  ${rel(v.file)}`);
  }
  console.error("\nSplit by responsibility; do not raise the limit without a reason.");
  process.exit(1);
}

console.log(`kelir-split: OK - ${files.length} files are <= ${MAX} lines.`);
