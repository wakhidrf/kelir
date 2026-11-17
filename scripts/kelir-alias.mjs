// kelir-alias.mjs - absolute-import gate (issue #110).
//
// Every import under <project>/src must use the "@/" alias; relative imports
// ("./", "../") are rejected. The vendored kit at src/views/kelir is exempt
// because it has its own internal rules.
//
// No dependencies. Exits 1 when a violation is found.
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// scripts/ -> kelir/ -> views/ -> src/ -> <project>
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KIT = join(SRC, "views", "kelir");

const EXT_RE = /\.(?:ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const RELATIVE_RE =
  /(?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)(["'])(\.{1,2}\/[^"']+)\1/g;

if (!existsSync(SRC)) {
  console.error(
    "kelir-alias: cannot find <project>/src at " +
      `${SRC}.\n` +
      "  Run this from a consumer project that uses Kelir.",
  );
  process.exit(2);
}

const rel = (p) => relative(ROOT, p).split(sep).join("/");
const lineAt = (src, idx) => src.slice(0, idx).split("\n").length;
const inKit = (p) => p === KIT || p.startsWith(KIT + sep);

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") {
      continue;
    }
    const full = join(dir, entry.name);
    if (inKit(full)) continue;
    if (entry.isDirectory()) await walk(full, out);
    else if (EXT_RE.test(entry.name)) out.push(full);
  }
  return out;
}

// Blank comments so imports inside comments are not reported. Strings are
// preserved because the import specifier lives inside a string.
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

const files = await walk(SRC);
const offenders = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const scanned = blankComments(source);
  for (const match of scanned.matchAll(RELATIVE_RE)) {
    offenders.push({
      file,
      line: lineAt(source, match.index),
      spec: match[2],
    });
  }
}

if (offenders.length > 0) {
  console.error(`kelir-alias: ${offenders.length} relative imports outside src/views/kelir.`);
  for (const o of offenders) {
    console.error(`  ${rel(o.file)}:${o.line} -> ${o.spec}`);
  }
  console.error("\nUse the @/ alias (see tsconfig paths).");
  process.exit(1);
}

console.log(`kelir-alias: OK - ${files.length} files use absolute imports.`);
