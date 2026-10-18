// kelir-drift.mjs — P1d STYLE.md: cek nama + props §5 vs kelir-types.ts.
// Dep-free (regex, bukan ts-morph — cukup untuk parity nama & daftar prop;
// ts-morph penuh ditunda sampai dibutuhkan). Mismatch = exit 1 (CI merah).
// Aturan:
//   - Nama: §5 (tanpa suffix "(terencana)") ↔ interface *Props, dua arah.
//     Pengecualian: KelirContextValue (context), QuestionnaireQuestion +
//     SelectOption (helper shape), SelectProps memakai SelectOption.
//   - "(terencana)" basi (sudah ada implementasi) = mismatch.
//   - Props §5 → kode: setiap identifier di span backtick (grup paren
//     dibuang dulu agar nilai union tak terbaca sebagai prop; isi {..}
//     diverifikasi ke Props ∪ helper) wajib ada di interface.
//   - Kode → §5: setiap prop interface eksplisit wajib ada di baris §5,
//     kecuali props standar {id, aria-label}.
//   - Interface warisan (extends Mui*/HTML): cek nama saja (detail prop
//     dikunci saat disegel Gelombang berikutnya).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// scripts/ -> kelir/ -> views/ -> src/ -> <proyek>
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const KELIR = join(ROOT, "src", "views", "kelir");
const KELIR_COMP = join(KELIR, "kelir-components");

const HELPER_IFACES = new Set(["BreadcrumbItem", "CommandGroup", "CommandItem", "ContextMenuItem", "DataTableColumn", "DropdownMenuItem", "KelirContextValue", "MenubarItem", "MenubarMenu", "NativeSelectOption", "NavigationMenuItem", "QuestionnaireOption", "QuestionnaireQuestion", "SelectOption", "TabsItem", "ToggleGroupOption", "TypographySegment"]);
const STANDARD_PROPS = new Set(["id", "aria-label", "aria-describedby"]);
const TS_PRIMITIVES = new Set([
  "string", "number", "boolean", "void", "any", "never", "unknown",
  "object", "null", "undefined", "true", "false",
]);
const mismatch = [];
const fail = (msg) => mismatch.push(msg);

function parseInterfaces() {
  // Normalisasi CRLF: working copy Windows (autocrlf) memakai \r\n.
  const src = readFileSync(join(KELIR, "kelir-types.ts"), "utf8").replace(
    /\r\n/g,
    "\n",
  );
  const ifaces = new Map(); // name -> {props, explicit, body}
  const re = /export interface (\w+)\s*([^{]*)\{/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const name = m[1];
    const decl = m[2];
    let depth = 1;
    let i = re.lastIndex;
    for (; i < src.length && depth > 0; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") depth--;
    }
    const body = src.slice(re.lastIndex, i - 1);
    re.lastIndex = i;
    const props = new Set();
    for (const ln of body.split("\n")) {
      const pm = ln.match(/^\s*["']?([\w-]+)["']?\s*\??:/);
      if (pm) props.add(pm[1]);
    }
    // Normalisasi whitespace: extends Omit<...> multi-baris tetap terdeteksi.
    const flat = decl.replace(/\s+/g, "");
    const inherited = /extends(Omit<Mui|Mui\w+|React\.\w*HTMLAttributes|Omit<React\.\w*HTMLAttributes)/.test(flat);
    ifaces.set(name, { props, explicit: !inherited, decl: flat });
  }
  // Transitif: extends XProps yang warisan ⇒ ikut warisan (mis. Sheet→Drawer).
  let changed = true;
  while (changed) {
    changed = false;
    for (const [name, info] of ifaces) {
      if (!info.explicit) continue;
      const m = info.decl.match(/^extends(\w+)$/);
      if (m && ifaces.has(m[1]) && !ifaces.get(m[1]).explicit) {
        info.explicit = false;
        changed = true;
      }
    }
  }
  return ifaces;
}

function implExists(component) {
  if (component === "KelirProvider") return true;
  try {
    for (const f of readdirSync(KELIR_COMP)) {
      if (!f.endsWith(".tsx") || f.endsWith(".test-d.tsx") || f.endsWith(".test.tsx")) continue;
      const src = readFileSync(join(KELIR_COMP, f), "utf8");
      if (new RegExp(`export function ${component}\\b`).test(src)) return true;
    }
  } catch { /* abaikan */ }
  return false;
}

function parseTable() {
  // Normalisasi CRLF: working copy Windows (autocrlf) memakai \r\n
  // (tanpanya jangkar `\|$` gagal di semua baris).
  const stylePath = join(ROOT, "STYLE.md");
  // Preflight (issue #72): kontrak §5 tinggal di akar proyek induk, bukan di
  // repo kit. Gagal dengan pesan jelas bila dipanggil dari kit tanpa induk.
  if (!existsSync(stylePath)) {
    throw new Error(
      `kelir-drift: STYLE.md tak ditemukan di ${stylePath}.\n` +
        "  Skrip ini membaca kontrak §5 dari akar proyek induk; jalankan dari\n" +
        "  proyek konsumen (mis. `npm run kelir:drift` di kelir-web), bukan dari repo kit.",
    );
  }
  const src = readFileSync(stylePath, "utf8").replace(
    /\r\n/g,
    "\n",
  );
  const rows = [];
  for (const ln of src.split("\n")) {
    const m = ln.match(/^\| ([^|]+?) \| ([^|]+?) \| (.+) \|$/);
    if (!m) continue;
    const no = m[1].trim();
    if (no === "No" || no === "Dulu") continue;
    if (!/^(0|—|-|\d+[a-z]?)$/.test(no)) continue;
    let name = m[2].trim();
    const planned = /\(terencana\)\s*$/.test(name);
    name = name.replace(/\s*\(terencana\)\s*$/, "");
    rows.push({ name, planned, cell: m[3] });
  }
  return rows;
}

function docProps(cell) {
  // Buang grup paren (nilai union) agar tak terbaca sebagai prop.
  const noParen = cell.replace(/\([^()]*\)/g, " ");
  const props = new Set();
  const notes = [];
  for (const span of noParen.matchAll(/`([^`]*)`/g)) {
    const text = span[1];
    if (text.startsWith("@")) { notes.push(text); continue; } // anotasi, bukan prop
    for (const chunk of text.split(/[\s,/{}[\]:;.]+/)) {
      const id = chunk.replace(/\?$/, "").replace(/^['"]|['"]$/g, "");
      if (/^[A-Za-z][\w-]*$/.test(id) && !TS_PRIMITIVES.has(id)) props.add(id);
    }
  }
  return { props, notes };
}

const ifaces = parseInterfaces();
const rows = parseTable();
const rowNames = new Set(rows.map((r) => r.name));

// 1. Nama dua arah.
for (const r of rows) {
  const inCode = ifaces.has(`${r.name}Props`) || (r.name === "KelirProvider" && ifaces.has("KelirProviderProps"));
  if (!inCode) fail(`§5 tanpa interface: ${r.name}`);
  if (r.planned && implExists(r.name)) fail(`"(terencana)" basi di §5 (sudah ada implementasi): ${r.name}`);
}
for (const [name] of ifaces) {
  if (HELPER_IFACES.has(name)) continue;
  const comp = name === "KelirProviderProps" ? "KelirProvider" : name.replace(/Props$/, "");
  if (!rowNames.has(comp)) fail(`interface tanpa baris §5: ${name}`);
}

// 2. Props dua arah (hanya interface eksplisit).
const helperProps = new Set();
for (const h of HELPER_IFACES) {
  const hIface = ifaces.get(h);
  if (hIface) for (const p of hIface.props) helperProps.add(p);
}
for (const r of rows) {
  const ifaceName = r.name === "KelirProvider" ? "KelirProviderProps" : `${r.name}Props`;
  const iface = ifaces.get(ifaceName);
  if (!iface) continue;
  // 3. @kelirNote §5 wajib ada sebagai tag JSDoc di tipe (§4 STYLE.md).
  const { props: documented, notes } = docProps(r.cell);
  for (const n of notes) {
    if (n.startsWith("@kelirNote")) {
      const tag = n.replace(/^@kelirNote\s+/, "");
      const src = readFileSync(join(KELIR, "kelir-types.ts"), "utf8");
      const idx = src.indexOf(`export interface ${ifaceName}`);
      const context = src.slice(Math.max(0, idx - 800), idx);
      if (!context.includes(`@kelirNote ${tag}`)) {
        fail(`@kelirNote hilang di tipe: ${ifaceName} tak memuat "@kelirNote ${tag}"`);
      }
    }
  }
  if (!iface.explicit) continue;
  for (const p of documented) {
    if (!iface.props.has(p) && !helperProps.has(p)) {
      fail(`§5 → kode hilang: ${r.name}.${p} (ada di tabel, tak ada di ${ifaceName})`);
    }
  }
  for (const p of iface.props) {
    if (!documented.has(p) && !STANDARD_PROPS.has(p)) {
      fail(`kode → §5 hilang: ${r.name}.${p} (ada di ${ifaceName}, tak ada di tabel)`);
    }
  }
}

if (mismatch.length > 0) {
  console.error(`kelir-drift: ${mismatch.length} MISMATCH`);
  for (const m of mismatch) console.error(`  - ${m}`);
  process.exit(1);
}
console.log(`kelir-drift: OK — ${rows.length} baris §5 vs ${ifaces.size} interface selaras.`);
