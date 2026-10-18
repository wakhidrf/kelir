// kelir-status.mjs — P1d STYLE.md: generator KELIR-STATUS.md tanpa dep baru.
// Status diturunkan dari FAKTA, bukan tulisan tangan:
//   - interface eksplisit (tanpa extends Omit<Mui*>/Mui*/React.HTMLAttributes)
//   - ada <basis>.test-d.tsx (kontrak tipe, §6b)
//   - ada <basis>.test.tsx DAN lolos vitest (runtime spread + axe, §6b)
//   - guard 0 error (grep, §9)
// Tangga: belum → tipe-eksplisit → sealed. (lint-bersih pensiun: Biome
// mengecualikan kit; diganti gate tsc+guard di PLAN.md.)
// Mode: tulis (default) vs --check (bandingkan file, exit 1 bila beda = CI merah).
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// scripts/ -> kelir/ -> views/ -> src/ -> <proyek>
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const KELIR = join(ROOT, "src", "views", "kelir");
const KELIR_COMP = join(KELIR, "kelir-components");
const STATUS_FILE = join(ROOT, "KELIR-STATUS.md");
const CHECK = process.argv.includes("--check");

// Gel.1 = selesai disegel (basis MUI + test-d + runtime + axe).
const GEL1 = new Set([
  "KelirProvider", "Button", "IconButton", "Stack", "Grid", "Spacer",
  "Typography", "Input", "Card", "Dialog", "Select", "Marker",
  "Spinner", "Separator",
]);

function parseTypes() {
  const src = readFileSync(join(KELIR, "kelir-types.ts"), "utf8");
  const out = [];
  const re = /export interface (\w+Props)\s*([^{]*)\{/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const name = m[1];
    const decl = m[2];
    const inherited = /extends\s+(Omit<Mui|Mui\w+|React\.HTMLAttributes)/.test(decl);
    out.push({ props: name, component: name.replace(/Props$/, ""), explicit: !inherited });
  }
  return out;
}

function findImpl(component) {
  if (component === "KelirProvider") return { dir: KELIR, base: "kelir-provider" };
  for (const f of readdirSync(KELIR_COMP)) {
    if (!f.endsWith(".tsx") || f.endsWith(".test-d.tsx") || f.endsWith(".test.tsx")) continue;
    const src = readFileSync(join(KELIR_COMP, f), "utf8");
    if (new RegExp(`export function ${component}\\b`).test(src)) {
      return { dir: KELIR_COMP, base: f.replace(/\.tsx$/, "") };
    }
  }
  return null;
}

function guardErrors() {
  try {
    execSync("node src/views/kelir/scripts/kelir-guard.mjs", { cwd: ROOT, stdio: "pipe" });
    return 0;
  } catch (e) {
    const out = (e.stdout?.toString() ?? "") + (e.stderr?.toString() ?? "");
    const m = out.match(/(\d+) ERROR/);
    return m ? parseInt(m[1], 10) : -1;
  }
}

function vitestPassedFiles() {
  // Vitest 5 menulis JSON ke file (.vitest/json/output.json), bukan stdout.
  // File tetap ditulis walau ada test gagal (exit ≠ 0) — baca granular
  // per-file agar satu kegagalan tak mencabut status sealed komponen lain.
  const readReport = () => {
    const report = JSON.parse(
      readFileSync(join(ROOT, ".vitest", "json", "output.json"), "utf8"),
    );
    const passed = new Set();
    for (const r of report.testResults ?? []) {
      if (r.status === "passed") passed.add(r.name.replace(/\\/g, "/"));
    }
    return passed;
  };
  try {
    execSync("npx vitest run --reporter=json", {
      cwd: ROOT, stdio: ["ignore", "ignore", "ignore"], timeout: 300000,
    });
    return readReport();
  } catch {
    try {
      return readReport();
    } catch {
      return null; // vitest gagal total → tak ada bukti runtime
    }
  }
}

function readGel() {
  // Kolom Gel. milik tabel lama dipertahankan (pengetahuan manual Gel.2/3).
  const gel = new Map();
  if (!existsSync(STATUS_FILE)) return gel;
  for (const ln of readFileSync(STATUS_FILE, "utf8").split("\n")) {
    const m = ln.match(/^\| ([^|]+?) \| (?:belum|tipe-eksplisit|sealed|terencana) \| (\d+) \|/);
    if (m) gel.set(m[1].trim(), m[2]);
  }
  return gel;
}

// Preflight (issue #72): status menurunkan KELIR-STATUS.md + menjalankan
// guard dari cwd <proyek> induk; gagal jelas bila dipanggil dari repo kit.
if (!existsSync(join(ROOT, "src"))) {
  console.error(
    "kelir-status: tidak menemukan <proyek>/src di " +
      `${join(ROOT, "src")}.\n` +
      "  Jalankan dari proyek konsumen yang menaruh kit di src/views/kelir\n" +
      "  (mis. `npm run kelir:status` di kelir-web), bukan dari repo kit sendiri.",
  );
  process.exit(2);
}

const types = parseTypes();
const errors = guardErrors();
const passedFiles = vitestPassedFiles();
const oldGel = readGel();

const rows = [];
for (const t of types) {
  const impl = findImpl(t.component);
  const testD = impl && existsSync(join(impl.dir, `${impl.base}.test-d.tsx`));
  const testRun = impl && existsSync(join(impl.dir, `${impl.base}.test.tsx`));
  const runtimePass =
    testRun && passedFiles &&
    [...passedFiles].some((p) => p.endsWith(`/${impl.base}.test.tsx`));
  let status = "belum";
  let bukti = "—";
  if (t.explicit && testD && testRun && runtimePass && errors === 0) {
    status = "sealed";
    bukti = "eksplisit + test-d + vitest lolos + guard 0 error";
  } else if (t.explicit && testD) {
    status = "tipe-eksplisit";
    const kurang = [];
    if (!testRun) kurang.push("tanpa runtime-test");
    else if (!runtimePass) kurang.push("vitest gagal");
    if (errors !== 0) kurang.push(`guard ${errors} ERROR`);
    bukti = kurang.join("; ");
  } else if (!t.explicit) {
    bukti = "warisan MUI/HTML (Omit/extends)";
  } else if (!testD) {
    bukti = "tanpa test-d";
  }
  const gel = GEL1.has(t.component) ? "1" : (oldGel.get(t.component) ?? "3");
  rows.push({ component: t.component, status, gel, bukti, impl: !!impl });
}

const sealed = rows.filter((r) => r.status === "sealed").length;
const eksplisit = rows.filter((r) => r.status === "tipe-eksplisit").length;
const date = new Date().toISOString().slice(0, 10);

const doc = `# KELIR-STATUS.md — Status sealed per komponen (DIHASILKAN SKRIP, jangan edit tangan)

> File ini **output generator** \`npm run kelir:status\` (§9 STYLE.md):
> status diturunkan dari fakta — interface eksplisit di \`kelir-types.ts\`,
> ada \`*.test-d.tsx\` (§6b), ada \`*.test.tsx\` dan lolos vitest (runtime
> spread + axe, §6b), guard 0 error (grep, §9). \`--check\` = CI merah bila
> isi ≠ fakta. Kontrak props ada di \`STYLE.md\` §5.
> Tangga: \`belum\` → \`tipe-eksplisit\` → \`sealed\`. (\`lint-bersih\`
> pensiun: Biome mengecualikan kit; diganti gate tsc+guard di PLAN.md.)
> Dibangkitkan: ${date} — sealed ${sealed}/${rows.length}, tipe-eksplisit ${eksplisit}/${rows.length}, guard ${errors} ERROR.

| Komponen | Status | Gel. | Bukti |
|----------|--------|------|-------|
${rows.map((r) => `| ${r.component} | ${r.status} | ${r.gel} | ${r.bukti} |`).join("\n")}
`;

if (CHECK) {
  const current = existsSync(STATUS_FILE) ? readFileSync(STATUS_FILE, "utf8").replace(/\r\n/g, "\n") : "";
  if (current !== doc) {
    console.error("kelir-status: tidak cocok - jalankan `npm run kelir:status` lalu commit hasilnya.");
    process.exit(1);
  }
  console.log(`kelir-status: OK - sealed ${sealed}/${rows.length}.`);
} else {
  writeFileSync(STATUS_FILE, doc);
  console.log(`kelir-status: ditulis - sealed ${sealed}/${rows.length}, tipe-eksplisit ${eksplisit}/${rows.length}.`);
}
