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
import { printReport } from "./kelir-report.mjs";
import { TOOLS_VERSION } from "./kelir-version.mjs";

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

const ALLOW_RE = /kelir-allow:\s*(.*)$/;
function allowReason(source, line) {
  const lines = source.split("\n");
  for (let i = line; i >= Math.max(1, line - 2); i--) {
    const m = ALLOW_RE.exec(lines[i - 1] ?? "");
    if (m && m[1].trim()) return m[1].trim();
  }
  return null;
}

for (const file of files) {
  const source = await readFile(file, "utf8");
  const scanned = blankComments(source);
  for (const match of scanned.matchAll(RELATIVE_RE)) {
    const line = lineAt(source, match.index);
    offenders.push({
      file,
      line,
      spec: match[2],
      reason: allowReason(source, line),
    });
  }
}

const blocked = offenders.filter((o) => !o.reason);
const allowed = offenders.filter((o) => o.reason);

printReport({
  gate: "kelir-alias",
  version: TOOLS_VERSION,
  status: blocked.length > 0 ? "FAIL" : "OK",
  counts: { error: blocked.length, warn: 0, allow: allowed.length },
  rows: [
    ...allowed.map((o) => ({
      level: "ALLOW",
      location: `${rel(o.file)}:${o.line}`,
      rule: "relative-import",
      message: `relative import '${o.spec}'`,
      suggestion: o.reason,
    })),
    ...blocked.map((o) => ({
      level: "ERROR",
      location: `${rel(o.file)}:${o.line}`,
      rule: "relative-import",
      message: `relative import '${o.spec}'`,
      suggestion: "use the @/ alias (see tsconfig paths)",
    })),
  ],
  emptyText: "(all imports use the @/ alias)",
  scope: { "files scanned": files.length },
});
if (blocked.length > 0) process.exit(1);
