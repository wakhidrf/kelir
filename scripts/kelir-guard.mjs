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
import { readdirSync, readFileSync, statSync } from "node:fs";
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

// 1+2. Konsumen: file di luar kelir yang mengimpor kelir-* + props terlarang
for (const f of walk(SRC)) {
  if (inKelir(f) || !/\.(tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  if (!/from\s+["'][^"']*kelir[^"']*["']/.test(src) && !/from\s+["']@\/views\/kelir/.test(src)) continue;
  const lines = src.split("\n");
  lines.forEach((ln, i) => {
    for (const p of BANNED_PROPS) {
      const m = ln.match(new RegExp(`\\b${p}\\s*[:=]`));
      if (m && /<[A-Z]/.test(ln)) add(warn, f, i + 1, `props terlarang '${p}' pada komponen (perlu review: Kelir?)`);
    }
    if (/<[a-z][a-zA-Z0-9]*[^>]*style\s*=/.test(ln))
      add(warn, f, i + 1, "slot heuristik: intrinsik ber-style inline di file pengimpor kelir");
  });
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

// 5. Interim wrapper: Stack/Grid/Spacer sudah ada → wrapper token layout
// wajib migrasi (warn→error per §8-P1b, tenggat 2026-11-10).
for (const f of walk(SRC)) {
  if (inKelir(f) || !/\.(tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  if (/css\.layout|var\(--space-|var\(--layout-/.test(src))
    add(err, f, 1, "layout interim: pakai Stack/Grid/Spacer, bukan wrapper token (§8-P1b)");
}

console.log(`kelir-guard: ${err.length} ERROR, ${warn.length} WARN`);
for (const w of warn) console.log(`WARN  ${w}`);
for (const e of err) console.log(`ERROR ${e}`);
if (STRICT && err.length > 0) process.exit(1);
