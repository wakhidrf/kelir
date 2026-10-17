// snapshot.mjs — generate kelir-mcp/snapshot.json dari sumber tunggal kit.
//
// Sumber: STYLE.md §5 (kontrak komponen, tabel Markdown) + kit README.md
// (deskripsi per komponen, pola `N. **Nama**: ...` ala sync-kelir-docs) +
// kelir-types.ts (union Theme) + kelir-layout/motion/variants.ts (token).
// Semua parsing TEKS (regex); tanpa import .ts (kelir-types.ts menarik MUI).
// Output deterministik penuh dari sumber (tanpa kitRev/timestamp) - komit
// timestamp) — test golden membandingkan regenerasi vs file ter-commit.
//
// Pakai: node kelir-mcp/tools/snapshot.mjs [--style STYLE.md] [--out snapshot.json]
// Default --style = ../../../STYLE.md dari root kit (layout submodule induk);
// wajib ada (kontrak §5–§6 tinggal di induk).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MCP_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KIT_ROOT = join(MCP_ROOT, "..");

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const STYLE_PATH = resolve(arg("--style", join(KIT_ROOT, "..", "..", "..", "STYLE.md")));
const OUT_PATH = resolve(arg("--out", join(MCP_ROOT, "snapshot.json")));

const read = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n");

// Pola parseTable kelir-drift.mjs: baris `| No | Komponen | Hanya boleh |`.
function parseContractTable(styleSrc) {
  const rows = [];
  for (const ln of styleSrc.split("\n")) {
    const m = ln.match(/^\| ([^|]+?) \| ([^|]+?) \| (.+) \|$/);
    if (!m) continue;
    const no = m[1].trim();
    if (no === "No" || no === "Dulu") continue;
    if (!/^(0|—|-|\d+[a-z]?)$/.test(no)) continue;
    rows.push({ name: m[2].trim().replace(/\s*\(terencana\)\s*$/, ""), props: m[3].trim() });
  }
  if (rows.length === 0) throw new Error(`snapshot: tak ada baris §5 di ${STYLE_PATH}`);
  return rows;
}

// Pola sync-kelir-docs.mjs induk: `N. **Nama**: deskripsi`.
function parseReadmeDescriptions(readmeSrc) {
  const map = new Map();
  for (const m of readmeSrc.matchAll(/^(\d+)\.\s+\*\*(.+?)\*\*:\s*(.+)$/gm)) {
    map.set(norm(m[2]), m[3].trim());
  }
  return map;
}
const norm = (s) => s.toLowerCase().replace(/[\s-]+/g, "");

// Parser sempit fail-closed: literal objek berisi string/nested saja.
// Bukan eval — bentuk asing (fungsi, spread, template) = throw nyaring.
function parseStringMap(src, start) {
  let i = src.indexOf("{", start);
  if (i < 0) throw new Error("snapshot: `{` tak ditemukan");
  i++;
  const obj = {};
  const ws = () => { while (/\s/.test(src[i])) i++; };
  ws();
  if (src[i] === "}") return [obj, i + 1];
  for (;;) {
    ws();
    if (src[i] === "}") return [obj, i + 1]; // trailing comma
    const km = src.slice(i).match(/^["']?([\w-]+)["']?\s*:/);
    if (!km) throw new Error(`snapshot: key tak dikenali di offset ${i}: ${src.slice(i, i + 40)}`);
    i += km[0].length;
    ws();
    if (src[i] === "{") {
      const [nested, end] = parseStringMap(src, i);
      obj[km[1]] = nested;
      i = end;
    } else {
      const vm = src.slice(i).match(/^"((?:[^"\\]|\\.)*)"|^'((?:[^'\\]|\\.)*)'/);
      if (!vm) throw new Error(`snapshot: value ${km[1]} bukan string di offset ${i}`);
      obj[km[1]] = vm[1] ?? vm[2];
      i += vm[0].length;
    }
    ws();
    if (src[i] === ",") { i++; continue; }
    if (src[i] === "}") return [obj, i + 1];
    throw new Error(`snapshot: terminator tak dikenali di offset ${i}: ${src.slice(i, i + 20)}`);
  }
}
function constMap(src, constName) {
  const m = src.match(new RegExp(`export const ${constName}[^=]*=\\s*`));
  if (!m) throw new Error(`snapshot: export const ${constName} tak ditemukan`);
  return parseStringMap(src, m.index + m[0].length)[0];
}
function themeUnion(typesSrc) {
  const m = typesSrc.match(/export type Theme =([\s\S]*?);/);
  if (!m) throw new Error("snapshot: union Theme tak ditemukan");
  const slugs = [...m[1].matchAll(/"([\w-]+)"/g)].map((x) => x[1]);
  if (slugs.length === 0) throw new Error("snapshot: union Theme kosong");
  return slugs;
}
function contractText(n) {
  return [
    `Kelir sealed contract (STYLE.md §5–§6; ${n} components in this snapshot).`,
    `Binding source is kelir-types.ts; prose here is a summary, not the contract.`,
    ``,
    `- Each component accepts ONLY its listed props: content (ISI), meaning (MAKNA), behavior (PERILAKU).`,
    `- MUI is Kelir's base, not a ban. In consumer code EVERY UI component must come from Kelir: using a raw MUI component as UI, or assembling your own rival from MUI primitives, is a violation. MUI non-component use stays fine: icons (@mui/icons-material), hooks (useMediaQuery), and the Next.js cache provider.`,
    `- NEVER pass style/sx/className/slotProps/classes/componentsProps/components/slots/slot, raw hex colors, or off-token sizes. No ...rest spread to the DOM.`,
    `- data-* attributes: only data-testid. Visuals come only from KelirProvider themes.`,
    `- Layout via Stack/Grid/Spacer/Container/FlexItem/Shell; single breakpoint source 768px (heroCollapse); spacing scale xs–4xl (4–64px).`,
    `- Server Actions live in server actions, never inside "use client" views; one breakpoint source; verify with tsc + guard + axe runtime tests.`,
  ].join("\n");
}

const styleSrc = read(STYLE_PATH);
const rows = parseContractTable(styleSrc);
const descriptions = parseReadmeDescriptions(read(join(KIT_ROOT, "README.md")));
const typesSrc = read(join(KIT_ROOT, "kelir-types.ts"));
const layoutSrc = read(join(KIT_ROOT, "kelir-layout.ts"));
const motionSrc = read(join(KIT_ROOT, "kelir-motion.ts"));
const variantsSrc = read(join(KIT_ROOT, "kelir-variants.ts"));

// Tanpa kitRev/timestamp: output deterministik penuh dari sumber - komit
// apa pun tak men-basi-kan snapshot; freshness ditegakkan murni oleh
// banding-konten (test gagal bila sumber berubah tanpa regenerasi).
const snapshot = {
  snapshot: 1,
  generator: "kelir-mcp/tools/snapshot.mjs (do not edit by hand)",
  components: rows.map((r) => ({
    name: r.name,
    // README tak memuat provider (§5 baris 0): deskripsi kurasi stabil.
    description: descriptions.get(norm(r.name)) ??
      (r.name === "KelirProvider"
        ? "The single legitimate visual point: theme provider (defaultTheme closed union, children)."
        : ""),
    props: r.props,
  })),
  tokens: {
    themes: themeUnion(typesSrc),
    space: constMap(layoutSrc, "layout").space,
    container: constMap(layoutSrc, "layout").container,
    sectionGap: constMap(layoutSrc, "layout").sectionGap,
    breakpoints: constMap(layoutSrc, "layout").breakpoints,
    zIndex: constMap(layoutSrc, "layout").zIndex,
    motion: {
      ease: constMap(motionSrc, "easeMotion").duration,
      spring: constMap(motionSrc, "springMotion").duration,
      liquidGlass: constMap(motionSrc, "liquidGlassMotion").duration,
    },
    statusColors: constMap(variantsSrc, "statusColors"),
    shadows: constMap(variantsSrc, "shadows"),
  },
  contract: contractText(rows.length),
};

writeFileSync(OUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`snapshot: OK (${rows.length} komponen, deterministik) -> ${OUT_PATH}`);
