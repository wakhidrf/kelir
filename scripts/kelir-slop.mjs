// kelir-slop.mjs - gate anti-slop repo (F6).
//
// Memindai kode yang SHIPPED (konsumen di <proyek>/src minus kit, plus internal
// kit minus mirror/vendor) memakai matcher yang sama dengan MCP (satu sumber:
// kelir-mcp/antislop.mjs). Tanpa dep baru, tanpa jaringan.
//
// Semantik (sengaja, sesuai rulebook upstream):
//   - Aturan code (jsx/css/komentar) -> dijalankan atas sumber mentah.
//   - Aturan text (copy)            -> HANYA atas string/teks JSX yang tampil ke
//     pengguna; komentar kode bukan "copy" (upstream memisahkan antislop-code).
//   - Aturan both (emoji)           -> keduanya.
//   - Baris ber-'kelir-allow: slop' = pengecualian eksplisit per baris (alasan
//     wajib ditulis di komentar), dilaporkan sebagai ALLOW (bukan sunyi).
//
// Mode: --strict -> exit 1 bila ada ERROR. Cakupan selalu dicetak.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { MATCHERS, loadAntiSlop } from "../kelir-mcp/antislop.mjs";

// scripts/ -> kelir/ -> views/ -> src/ -> <proyek>
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KELIR = join(SRC, "views", "kelir");
const MCP = join(KELIR, "kelir-mcp");
const STRICT = process.argv.includes("--strict");

const CODE_EXT = /\.(tsx?|jsx?|mjs|cjs|css)$/;
const TEST_EXT = /\.(test|test-d)\.(tsx?|jsx?)$/;
// Di-generate / di-vendor: bukan milik kita untuk disunting.
const GENERATED = [
  join(MCP, "antislop"), // mirror upstream (jangan disentuh)
  join(SRC, "views", "kelir-docs.ts"), // dari README/CHANGELOG
];
// Berkas spesifikasi: memuat rulebook sendiri / korpus slop untuk uji gate.
const SPEC = [
  join(MCP, "antislop.mjs"), // tabel matcher = rulebook-nya sendiri
  join(MCP, "tools", "test.mjs"), // korpus slop ("Our BEST-IN-CLASS ... 10x")
  join(KELIR, "scripts", "kelir-slop.mjs"), // gate ini (memuat literal allow)
];

// Kit internal adalah IMPLEMENTASI (mis. outline:none + ring sendiri,
// tema glassmorphism, radius pill): aturan code ui/mobile/a11y di sini
// false positive by design. Yang tetap dicek: copy (teks ke pengguna),
// emoji hiasan, dan higiene komentar.
const kitAllows = (m) => m.scope === "text" || m.scope === "both" || m.rule.startsWith("antislop-code--");

if (!existsSync(SRC)) {
  console.error(
    "kelir-slop: tidak menemukan <proyek>/src di " +
      `${SRC}.\n` +
      "  Jalankan dari proyek konsumen yang menaruh kit di src/views/kelir\n" +
      "  (mis. `npm run kelir:slop` di kelir-web), bukan dari repo kit sendiri.",
  );
  process.exit(2);
}

const rel = (p) => relative(ROOT, p).replace(/\\/g, "/");
const lineAt = (src, idx) => src.slice(0, idx).split("\n").length;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".next") continue;
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (CODE_EXT.test(e)) out.push(p);
  }
  return out;
}

// Teks yang tampil ke pengguna: isi literal '...' "..." `...` (bagian literal
// template saja) + node teks JSX (di luar {ekspresi}).
function copySpans(src) {
  const spans = [];
  const n = src.length;
  let i = 0;
  const st = [{ t: "code" }];
  const cur = () => st[st.length - 1];
  const prevCode = () => {
    for (let j = i - 1; j >= 0; j--) {
      const c = src[j];
      if (c === " " || c === "\t" || c === "\r" || c === "\n") continue;
      return c;
    }
    return "";
  };
  while (i < n) {
    const c = src[i];
    const two = src.slice(i, i + 2);
    const s = cur().t;
    if (s === "code" || s === "tplExpr") {
      if (two === "//") { st.push({ t: "line" }); i += 2; continue; }
      if (two === "/*") { st.push({ t: "block" }); i += 2; continue; }
      if (c === "'" || c === '"' || c === "`") {
        st.push({ t: c === "'" ? "sq" : c === '"' ? "dq" : "tpl", start: i + 1 });
        i++;
        continue;
      }
      if (c === "/" && "=(,:[!&|?{};".includes(prevCode())) { st.push({ t: "regex" }); i++; continue; }
      if (s === "tplExpr" && c === "{") { cur().d++; i++; continue; }
      if (s === "tplExpr" && c === "}") {
        i++;
        if (--cur().d === 0) st.pop();
        continue;
      }
      i++;
      continue;
    }
    if (s === "line") { if (c === "\n") st.pop(); i++; continue; }
    if (s === "block") { if (two === "*/") { i += 2; st.pop(); } else i++; continue; }
    if (s === "regex") {
      if (c === "\\") { i += 2; continue; }
      if (c === "[") { cur().cls = true; i++; continue; }
      if (c === "]") { cur().cls = false; i++; continue; }
      if (c === "/" && !cur().cls) { i++; st.pop(); continue; }
      i++;
      continue;
    }
    // sq | dq | tpl: kumpulkan isi literal.
    if (c === "\\") { i += 2; continue; }
    const q = s === "sq" ? "'" : s === "dq" ? '"' : "`";
    if (c === q) { spans.push({ start: cur().start, end: i }); st.pop(); i++; continue; }
    if (s === "tpl" && two === "${") { spans.push({ start: cur().start, end: i }); st.push({ t: "tplExpr", d: 1 }); i += 2; continue; }
    i++;
  }
  return spans;
}

// Node teks JSX: teks di antara '>' dan '<' pada kedalaman kurung 0.
function jsxTextSpans(src) {
  const spans = [];
  const masked = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + m.slice(p1.length).replace(/[^\n]/g, " "));
  const re = /<[A-Za-z][^>]*>([^<>{}]+)</g;
  let m;
  while ((m = re.exec(masked)) !== null) {
    const inner = m[1];
    if (!/[A-Za-z]/.test(inner)) continue;
    const start = m.index + m[0].length - 1 - inner.length;
    spans.push({ start, end: start + inner.length });
  }
  return spans;
}

// String yang jelas berupa kode/nilai (className, style, token util) bukan copy.
function looksLikeCode(text) {
  if (!/[A-Za-z]/.test(text)) return true;
  if (/[{};]/.test(text)) return true;
  if (/^[-\w/.:#%()[\]]+$/.test(text.trim())) return true;
  return false;
}

const anti = loadAntiSlop(MCP);
const files = walk(SRC).filter(
  (f) => !GENERATED.some((g) => f.startsWith(g)) && !SPEC.includes(f),
);
const coverage = { consumer: 0, kit: 0, tests: 0, noImport: 0 };
const err = [];
const allowed = [];

for (const f of files) {
  const isKit = f.startsWith(KELIR);
  if (TEST_EXT.test(f)) { coverage.tests++; continue; }
  const src = readFileSync(f, "utf8");
  if (!isKit && !/\.css$/.test(f)) {
    const importsKit =
      /from\s+["'][^"']*kelir[^"']*["']/.test(src) || /from\s+["']@\/views\/kelir/.test(src);
    if (!importsKit) { coverage.noImport++; continue; }
    coverage.consumer++;
  } else if (isKit) {
    coverage.kit++;
  } else {
    coverage.consumer++;
  }

  const rules = MATCHERS.filter((m) => !isKit || kitAllows(m));
  const lines = src.split("\n");
  const allowedLine = (ln) =>
    (lines[ln - 1] ?? "").includes("kelir-allow: slop") ||
    (lines[ln - 2] ?? "").includes("kelir-allow: slop");
  const hits = [];

  // Aturan code (dan "both") atas sumber mentah.
  for (const m of rules) {
    if (m.scope === "code" || m.scope === "both") {
      const re = new RegExp(m.re.source, m.re.flags.replace("g", "") + "g");
      let hit;
      while ((hit = re.exec(src)) !== null) {
        hits.push({ rule: m.rule, why: m.why, line: lineAt(src, hit.index), excerpt: hit[0].slice(0, 60) });
        if (hit[0].length === 0) break;
      }
    }
  }

  // Aturan copy atas teks yang tampil ke pengguna.
  for (const sp of [...copySpans(src), ...jsxTextSpans(src)]) {
    const text = src.slice(sp.start, sp.end);
    if (looksLikeCode(text)) continue;
    for (const m of rules) {
      if (m.scope !== "text" && m.scope !== "both") continue;
      const re = new RegExp(m.re.source, m.re.flags.replace("g", "") + "g");
      let hit;
      while ((hit = re.exec(text)) !== null) {
        hits.push({
          rule: m.rule,
          why: m.why,
          line: lineAt(src, sp.start + hit.index),
          excerpt: hit[0].slice(0, 60),
        });
        if (hit[0].length === 0) break;
      }
    }
  }

  // Dedupe rule+line; em dash (R-02) menyerap varian copywriting-nya.
  const seen = new Set();
  const dashLines = new Set(hits.filter((h) => h.rule === "R-02").map((h) => h.line));
  for (const h of hits) {
    if (h.rule === "antislop-copywriting--em-dashes" && dashLines.has(h.line)) continue;
    const key = `${h.rule}@${h.line}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const meta = anti.rules.get(h.rule) ?? {};
    const entry = { f, ...h, target: meta.target ?? "", severity: meta.severity ?? null };
    if (allowedLine(h.line)) allowed.push(entry);
    else err.push(entry);
  }
}

const fmt = (x) => `${rel(x.f)}:${x.line}: ${x.rule} (${x.target || "core"}) - ${x.excerpt}`;
console.log(`kelir-slop: ${err.length} ERROR, ${allowed.length} ALLOW`);
for (const a of allowed) console.log(`ALLOW ${fmt(a)}`);
for (const e of err) console.log(`ERROR ${fmt(e)}`);
console.log(
  `cakupan: ${coverage.consumer} berkas konsumen + ${coverage.kit} berkas kit dipindai; ` +
    `dilewati resmi: ${coverage.tests} test, ${coverage.noImport} tanpa impor kelir, ` +
    `${GENERATED.length} generated/vendor, ${SPEC.length} spec/korpus.`,
);
if (STRICT && err.length > 0) process.exit(1);
