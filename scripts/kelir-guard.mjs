// kelir-guard.mjs — P1a STYLE.md: penjaga kontrak paten tanpa dep baru.
// Hidup di repo kit (src/views/kelir/scripts) agar ikut terbawa saat kit
// diimpor proyek lain (kit selalu di <proyek>/src/views/kelir).
// Mode: --strict (exit 1 bila ERROR) vs default warn (exit 0 + laporan).
// Cakupan: konsumen (src minus src/views/kelir) + kelir-components (hardcode).
// Presisi (2026-10-11, STYLE §9): (a) intrinsik + className SAJA bukan cue —
// consumer-CSS (stylesheet kelas milik app) adalah pola resmi (§8-P0/P1);
// cue tersisa untuk style inline (escape hatch riil). (b) data-kelir-*
// dikecualikan dari cek data-* (namespace milik kit = wiring kontrak
// Provider dari kelir-styles, bukan slot leak).
// Sintaks (2026-10-11, issue #27): cek konsumen naik ke level sintaks —
// komentar + isi string/regex disamarkan dulu, lalu tag JSX dipindai
// lintas-baris (style={{...}} multi-baris tak lagi lolos). Aturan prop
// komponen dibatasi ke nama kontrak kelir-types.ts (selaras GritQL;
// komponen milik app = urusan app, bukan kontrak). Pengecualian cakupan
// dicetak eksplisit di laporan (bukan sunyi).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// scripts/ -> kelir/ -> views/ -> src/ -> <proyek>
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KELIR = join(SRC, "views", "kelir");
const KELIR_COMP = join(KELIR, "kelir-components");
const STRICT = process.argv.includes("--strict");

const ALLOW_FILES = new Set(["kelir-styles.ts", "kelir-variants.ts"]);
const BANNED_PROPS = ["style", "sx", "className", "slotProps", "classes", "components", "componentsProps", "slot"];

// Nama komponen kontrak (sumber tunggal kelir-types.ts — derivasi sama
// dengan check-grit-sync): aturan prop hanya berlaku untuk nama ini.
const KELIR_NAMES = new Set(
  [...readFileSync(join(KELIR, "kelir-types.ts"), "utf8").matchAll(/^export interface (\w+)Props/gm)].map(
    (m) => (m[1] === "KelirProviderProps" ? "KelirProvider" : m[1].replace(/Props$/, "")),
  ),
);

// Cakupan eksplisit: dihitung saat jalan, dicetak di laporan (§8-P0/P1:
// yang dikecualikan resmi harus terlihat, bukan sunyi).
const scope = { scanned: 0, kitInternal: 0, noImport: 0 };

// Preflight (issue #72): guard mengasumsikan kit hidup di
// <proyek>/src/views/kelir. Bila dijalankan dari checkout repo kit sendiri
// (tanpa <proyek>/src) gagal dengan pesan jelas, bukan ENOENT samar.
if (!existsSync(SRC)) {
  console.error(
    "kelir-guard: tidak menemukan <proyek>/src di " +
      `${SRC}.\n` +
      "  Jalankan dari proyek konsumen yang menaruh kit di src/views/kelir\n" +
      "  (mis. `npm run kelir:guard` di kelir-web), bukan dari repo kit sendiri.",
  );
  process.exit(2);
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) { if (e !== "node_modules") walk(p, out); }
    else if (/\.(tsx?|jsx?|css|mdx?)$/.test(e)) out.push(p);
  }
  return out;
}
const rel = (p) => relative(ROOT, p).replace(/\\/g, "/");
const inKelir = (p) => p.startsWith(KELIR);
const warn = [];
const err = [];
const add = (list, file, line, msg) => list.push(`${rel(file)}:${line}: ${msg}`);

function lineNo(src, idx) { return src.slice(0, idx).split("\n").length; }

// 1+2. Konsumen: file di luar kelir yang mengimpor kelir-* + props terlarang.
// Level sintaks (issue #27): samarkan komentar + isi string/regex dulu
// (panjang + newline dipertahankan → nomor baris tepat), lalu pindai tag
// JSX lintas-baris. Pola sebaris lama lolos untuk style={{...}}
// multi-baris — itu yang diperbaiki di sini.
function blankNonCode(src) {
  const out = new Array(src.length);
  let i = 0;
  const n = src.length;
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
    if (s === "code" || s === "tplExpr" || s === "regex") {
      if (s === "regex") {
        if (c === "\\") { out[i] = " "; out[i + 1] = " "; i += 2; continue; }
        if (c === "[") { cur().cls = true; out[i] = " "; i++; continue; }
        if (c === "]") { cur().cls = false; out[i] = " "; i++; continue; }
        if (c === "/" && !cur().cls) { out[i] = " "; i++; st.pop(); continue; }
        out[i] = c === "\n" ? "\n" : " ";
        i++;
        continue;
      }
      if (two === "//") { st.push({ t: "line" }); out[i] = " "; out[i + 1] = " "; i += 2; continue; }
      if (two === "/*") { st.push({ t: "block" }); out[i] = " "; out[i + 1] = " "; i += 2; continue; }
      if (c === "'" || c === '"' || c === "`") { st.push({ t: c === "'" ? "sq" : c === '"' ? "dq" : "tpl" }); out[i] = c; i++; continue; }
      if (c === "/" && "=(,:[!&|?{};".includes(prevCode())) { st.push({ t: "regex", cls: false }); out[i] = " "; i++; continue; }
      if (s === "tplExpr" && c === "{") { cur().d++; out[i] = c; i++; continue; }
      if (s === "tplExpr" && c === "}") {
        out[i] = c; i++;
        if (--cur().d === 0) st.pop();
        continue;
      }
      out[i] = c; i++; continue;
    }
    if (s === "line") {
      if (c === "\n") { out[i] = c; st.pop(); } else out[i] = " ";
      i++; continue;
    }
    if (s === "block") {
      if (two === "*/") { out[i] = " "; out[i + 1] = " "; i += 2; st.pop(); }
      else { out[i] = c === "\n" ? "\n" : " "; i++; }
      continue;
    }
    // sq | dq | tpl: isi disamarkan, pembatas dipertahankan.
    if (c === "\\") { out[i] = " "; out[i + 1] = " "; i += 2; continue; }
    const q = s === "sq" ? "'" : s === "dq" ? '"' : "`";
    if (c === q) { out[i] = c; st.pop(); i++; continue; }
    if (s === "tpl" && two === "${") { out[i] = "$"; out[i + 1] = "{"; i += 2; st.push({ t: "tplExpr", d: 1 }); continue; }
    out[i] = c === "\n" ? "\n" : " ";
    i++;
  }
  return out.join("");
}

// Pindai tag JSX pada sumber tersamar: kembalikan [{tag, attrs:[{name, idx}]}].
// Atribut dibaca sampai '>' penutup pada kedalaman kurung 0 → tahan
// multi-baris + ekspresi bersarang; string sudah samara jadi '"' aman.
function scanJsxTags(blank) {
  const hits = [];
  const re = /<([A-Za-z][\w.]*)/g;
  let m;
  while ((m = re.exec(blank)) !== null) {
    const tag = m[1];
    let i = m.index + 1 + tag.length;
    let depth = 0;
    let end = -1;
    while (i < blank.length) {
      const c = blank[i];
      if (c === "{" || c === "(" || c === "[") depth++;
      else if (c === "}" || c === ")" || c === "]") depth = Math.max(0, depth - 1);
      else if (c === ">" && depth === 0) { end = i; break; }
      else if (c === "<" && depth === 0) break;
      i++;
    }
    if (end === -1) continue;
    const span = blank.slice(m.index + 1 + tag.length, end);
    const spanBase = m.index + 1 + tag.length;
    // Atribut hanya pada kedalaman 0: JSX bersarang dalam ekspresi
    // (mis. items={[{content: (<div className=...>)}]}) tak boleh
    // teratribusi ke tag luar.
    const attrs = [];
    let d = 0;
    let td = 0;
    let k = 0;
    const attrRe = /[A-Za-z][\w.-]*\s*=/y;
    while (k < span.length) {
      const c = span[k];
      if (c === "{" || c === "(" || c === "[") d++;
      else if (c === "}" || c === ")" || c === "]") d = Math.max(0, d - 1);
      else if (c === "<" && d === 0 && /[A-Za-z]/.test(span[k + 1] ?? "")) td++;
      else if (c === ">" && td > 0) td--;
      else if (d === 0 && td === 0 && /[\s/]/.test(c)) {
        attrRe.lastIndex = k + 1;
        const am = attrRe.exec(span);
        if (am) {
          const name = /^[A-Za-z][\w.-]*/.exec(am[0])[0];
          attrs.push({ name, idx: spanBase + k + 1 + am[0].indexOf(name) });
          k = attrRe.lastIndex - 1;
        }
      }
      k++;
    }
    hits.push({ tag, attrs });
  }
  return hits;
}

for (const f of walk(SRC)) {
  if (inKelir(f)) { if (/\.(tsx|jsx)$/.test(f)) scope.kitInternal++; continue; }
  if (!/\.(tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  if (!/from\s+["'][^"']*kelir[^"']*["']/.test(src) && !/from\s+["']@\/views\/kelir/.test(src)) { scope.noImport++; continue; }
  scope.scanned++;
  const blank = blankNonCode(src);
  for (const { tag, attrs } of scanJsxTags(blank)) {
    const base = tag.split(".")[0];
    const isKelir = KELIR_NAMES.has(base);
    for (const { name, idx } of attrs) {
      if (/^[A-Z]/.test(tag) && isKelir && BANNED_PROPS.includes(name))
        add(warn, f, lineNo(src, idx), `props terlarang '${name}' pada komponen (perlu review: Kelir?)`);
      else if (/^[a-z]/.test(tag) && name === "style")
        add(warn, f, lineNo(src, idx), "slot heuristik: intrinsik ber-style inline di file pengimpor kelir");
    }
  }
  const dataAttrs = [...src.matchAll(/data-[a-z-]+\s*=/g)].map((m) => m[0].split("=")[0].trim());
  const foreignData = dataAttrs.filter((a) => !a.startsWith("data-kelir-"));
  if (foreignData.length > 0 && /(style|StyleSheet|css)/.test(src))
    add(warn, f, 1, "data-* + styling terdeteksi (cek manual: untuk styling?)");
}

// 3. Override global .Mui* / .kelir-* di luar kelir
for (const f of walk(SRC)) {
  if (inKelir(f)) continue;
  if (!/\.(css|tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  const lines = src.split("\n");
  lines.forEach((ln, i) => {
    if (/\.Mui[A-Z][\w-]*\s*[{.,:#[]/.test(ln))
      add(err, f, i + 1, "override global .Mui* di luar kelir (haram §3b)");
    if (/\.kelir-[\w-]*\s*[{.,:#[]/.test(ln))
      add(warn, f, i + 1, "selector .kelir-* di luar kit (pastikan bukan internal kit §3b)");
  });
}

// 4. Hardcode di kelir-components (allowlist file + baris kelir-allow)
for (const f of walk(KELIR_COMP)) {
  const src = readFileSync(f, "utf8");
  const lines = src.split("\n");
  lines.forEach((ln, i) => {
    if (/kelir-allow:/.test(ln)) return;
    if (/(?<![&\w])#[0-9a-fA-F]{3,8}\b/.test(ln) && !/^\s*(\/\/|\*)/.test(ln))
      add(err, f, i + 1, "hex hardcode (pakai css.* atau pindah ke allowlist)");
    if (/rgba?\s*\(/.test(ln))
      add(err, f, i + 1, "rgba()/rgb() hardcode (pakai css.*)");
    if (/(box-shadow|font-family)\s*:/.test(ln))
      add(err, f, i + 1, "box-shadow/font-family mentah (pakai css.*)");
  });
}

// 5. Interim wrapper: Stack/Grid/Spacer/Container/FlexItem/Shell sudah
// ada → wrapper token layout wajib migrasi (warn→error per §8-P1b,
// tenggat 2026-11-10).
for (const f of walk(SRC)) {
  if (inKelir(f) || !/\.(tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  if (/css\.layout|var\(--space-|var\(--layout-/.test(src))
    add(err, f, 1, "layout interim: pakai Stack/Grid/Spacer/Container/FlexItem/Shell, bukan wrapper token (§8-P1b)");
}

console.log(`kelir-guard: ${err.length} ERROR, ${warn.length} WARN`);
for (const w of warn) console.log(`WARN  ${w}`);
for (const e of err) console.log(`ERROR ${e}`);
console.log(`cakupan: ${scope.scanned} file konsumen dipindai (sintaks JSX); dikecualikan resmi: ${scope.kitInternal} internal kit, ${scope.noImport} tanpa impor kelir, allowlist token: ${[...ALLOW_FILES].join(", ")}`);
if (STRICT && err.length > 0) process.exit(1);
