// kelir-hunt.mjs - gate adopsi: cari UI/UX di luar Kelir.
//
// Guard hanya memeriksa file yang MENGIMPOR Kelir. Hunt melengkapi:
//   - route (app/pages) yang merender tag intrinsik tanpa impor Kelir = ERROR
//   - komponen non-route dengan tag intrinsik tanpa Kelir = WARN (inventaris)
//   - canvas/iframe, konten dinamis, CSS-in-JS, stylesheet konsumen, dan impor
//     library UI pihak ketiga = WARN
//   - direktif Tailwind (@tailwind/@apply) = ERROR
//
// Hunt hanya melihat sinyal statis, bukan hasil render: "100% Kelir" tetap
// butuh review. Pengecualian eksplisit: `kelir-allow: hunt <alasan>` per file.
//
// Mode: --strict -> exit 1 bila ada ERROR. Default hanya laporan.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// scripts/ -> kelir/ -> views/ -> src/ -> <proyek>
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KELIR = join(SRC, "views", "kelir");
const STRICT = process.argv.includes("--strict");

const CODE_RE = /\.(tsx?|jsx?)$/;
const CSS_RE = /\.(css|scss|sass|less)$/;
const TEST_RE = /\.(test|spec|test-d|stories)\.(tsx?|jsx?)$/;
const SKIP_DIR_RE = /(^|\/)(__tests__|__mocks__|__fixtures__|fixtures|\.storybook)(\/|$)/;
const GENERATED = new Set([join(SRC, "views", "kelir-docs.ts")]);

const ROUTE_BASES = new Set([
  "page",
  "layout",
  "template",
  "error",
  "global-error",
  "not-found",
  "loading",
  "default",
]);
// Tag dokumen HTML bukan UI aplikasi (html/body wajib di root layout Next.js).
const DOC_TAGS = new Set([
  "html",
  "head",
  "body",
  "meta",
  "link",
  "script",
  "style",
  "title",
  "noscript",
  "template",
]);

// Library UI di luar stack Kelir (MUI/emotion sengaja TIDAK didaftarkan).
const THIRD_PARTY_UI = [
  "antd",
  "bootstrap",
  "react-bootstrap",
  "reactstrap",
  "semantic-ui-react",
  "grommet",
  "styled-components",
  "framer-motion",
  "motion",
  "@chakra-ui/",
  "@mantine/",
  "@radix-ui/",
  "@headlessui/",
  "@nextui-org/",
  "@heroui/",
  "@fluentui/",
  "@blueprintjs/",
  "@carbon/",
];
const CANVAS_LIBS = [
  "three",
  "chart.js",
  "react-chartjs-2",
  "d3",
  "pixi.js",
  "echarts",
  "echarts-for-react",
  "konva",
  "react-konva",
  "fabric",
  "@react-three/",
  "@pixi/",
];
const TAILWIND_RE = /@tailwind\b|@apply\b/;

const scope = { ui: 0, outside: 0, kit: 0, tests: 0, generated: 0, noJsx: 0, css: 0 };
const err = [];
const warn = [];
const allowed = [];

if (!existsSync(SRC)) {
  console.error(
    "kelir-hunt: tidak menemukan <proyek>/src di " +
      `${SRC}.\n` +
      "  Jalankan dari proyek konsumen yang menaruh kit di src/views/kelir\n" +
      "  (mis. `npm run kelir:hunt`), bukan dari repo kit sendiri.",
  );
  process.exit(2);
}

const rel = (p) => relative(ROOT, p).replace(/\\/g, "/");
const lineAt = (src, idx) => (idx < 0 ? 1 : src.slice(0, idx).split("\n").length);
// `kelir-docs.ts` tidak boleh dianggap internal kit hanya karena prefix nama.
const inKit = (p) => p.startsWith(KELIR + sep);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".next" || e === ".git") continue;
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (CODE_RE.test(e) || CSS_RE.test(e)) out.push(p);
  }
  return out;
}

// Samarkan komentar + isi string/regex agar sinyal hanya datang dari kode.
function blankNonCode(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + m.slice(p1.length).replace(/[^\n]/g, " "))
    .replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, (m) => m.replace(/[^\n]/g, " "));
}

function isRoute(relFromSrc) {
  const base = relFromSrc.split("/").pop().replace(CODE_RE, "");
  if (relFromSrc.startsWith("app/")) return ROUTE_BASES.has(base);
  if (relFromSrc.startsWith("pages/")) {
    return !relFromSrc.startsWith("pages/api/") && !base.startsWith("_");
  }
  return false;
}

const importsKelir = (src) =>
  /from\s+["'][^"']*kelir[^"']*["']/.test(src) || /from\s+["']@\/views\/kelir/.test(src);

function importsOf(src) {
  const out = [];
  for (const m of src.matchAll(/from\s+["']([^"']+)["']/g)) out.push({ spec: m[1], idx: m.index });
  for (const m of src.matchAll(/import\s*\(\s*["']([^"']+)["']\s*\)/g))
    out.push({ spec: m[1], idx: m.index });
  return out;
}

function packageMatches(spec, list) {
  return list.find((p) =>
    p.endsWith("/") ? spec.startsWith(p) : spec === p || spec.startsWith(`${p}/`),
  );
}

function allowReason(src) {
  const m = /kelir-allow:\s*hunt\b([^\n]*)/.exec(src);
  if (!m) return null;
  return { line: lineAt(src, m.index), reason: m[1].trim() || "tanpa alasan" };
}

function tagList(tags) {
  const unique = [...new Set(tags)];
  const shown = unique.slice(0, 8).map((t) => `<${t}>`).join(", ");
  return unique.length > 8 ? `${shown}, +${unique.length - 8}` : shown;
}

function commit(f, src, findings) {
  if (findings.length === 0) return;
  const allow = allowReason(src);
  if (allow) {
    allowed.push({ f, line: allow.line, msg: `${findings.length} temuan - ${allow.reason}` });
    return;
  }
  for (const x of findings) (x.level === "error" ? err : warn).push({ f, line: x.line, msg: x.msg });
}

for (const f of walk(SRC)) {
  if (inKit(f)) {
    if (CODE_RE.test(f)) scope.kit++;
    continue;
  }
  if (GENERATED.has(f)) {
    scope.generated++;
    continue;
  }

  const relFromSrc = relative(SRC, f).replace(/\\/g, "/");
  if (SKIP_DIR_RE.test(relFromSrc) || TEST_RE.test(f)) {
    scope.tests++;
    continue;
  }
  if (relFromSrc.startsWith("app/api/")) continue;

  const src = readFileSync(f, "utf8");
  const findings = [];

  if (CSS_RE.test(f)) {
    scope.css++;
    const tw = TAILWIND_RE.exec(src);
    if (tw) {
      findings.push({
        level: "error",
        line: lineAt(src, tw.index),
        msg: "direktif Tailwind (@tailwind/@apply): CSS konsumen haram",
      });
    } else {
      findings.push({
        level: "warn",
        line: 1,
        msg: "stylesheet konsumen di luar Kelir; pindahkan ke token/kit atau beri alasan",
      });
    }
    commit(f, src, findings);
    continue;
  }

  const masked = blankNonCode(src);
  const hasJsx = /<[A-Za-z][\w.]*[\s/>]/.test(masked);
  if (!hasJsx) {
    scope.noJsx++;
    continue;
  }

  const kelir = importsKelir(src);
  const route = isRoute(relFromSrc);
  const tags = [...masked.matchAll(/<([A-Za-z][\w.]*)/g)].map((m) => ({
    tag: m[1],
    idx: m.index,
  }));
  const intrinsic = tags.filter((t) => /^[a-z]/.test(t.tag) && !DOC_TAGS.has(t.tag));
  scope.ui++;
  if (!kelir) scope.outside++;

  if (!kelir && route && intrinsic.length > 0) {
    findings.push({
      level: "error",
      line: 1,
      msg: `route UI memakai tag intrinsik tanpa impor Kelir: ${tagList(intrinsic.map((t) => t.tag))}`,
    });
  } else if (!kelir && !route && intrinsic.length > 0) {
    findings.push({
      level: "warn",
      line: 1,
      msg: `UI tanpa impor Kelir (${intrinsic.length} tag intrinsik: ${tagList(intrinsic.map((t) => t.tag))})`,
    });
  }

  for (const tag of ["canvas", "iframe"]) {
    const hit = tags.find((t) => t.tag === tag);
    if (hit) {
      findings.push({
        level: "warn",
        line: lineAt(src, hit.idx),
        msg: `<${tag}> di luar komponen Kelir; bungkus + beri alasan`,
      });
    }
  }

  const sinks = [
    ["dangerouslySetInnerHTML", "HTML mentah via dangerouslySetInnerHTML"],
    ["innerHTML", "manipulasi innerHTML"],
    ["outerHTML", "manipulasi outerHTML"],
    ["ReactMarkdown", "render markdown (react-markdown)"],
    ["MDXContent", "render mdx dinamis"],
  ];
  for (const [needle, label] of sinks) {
    const idx = masked.indexOf(needle);
    if (idx !== -1) {
      findings.push({ level: "warn", line: lineAt(src, idx), msg: `konten dinamis: ${label}; batasi/sanitasi` });
    }
  }

  const cssInJs = [
    [/\bsx\s*=/, "prop sx= (CSS-in-JS)"],
    [/\bstyled\.[A-Za-z]/, "styled component"],
    [/\bstyled\s*\(/, "styled() factory"],
    [/\bmakeStyles\s*\(|\bwithStyles\s*\(/, "MUI makeStyles/withStyles"],
    [/\bcss\s*`/, "css template"],
  ];
  for (const [re, label] of cssInJs) {
    const m = re.exec(masked);
    if (m) {
      findings.push({ level: "warn", line: lineAt(src, m.index), msg: `CSS di luar Kelir: ${label}` });
    }
  }
  if (!kelir) {
    for (const [re, label] of [
      [/\bstyle\s*=\s*\{\{/, "inline style"],
      [/<style\b/, "blok <style>"],
    ]) {
      const m = re.exec(masked);
      if (m) {
        findings.push({ level: "warn", line: lineAt(src, m.index), msg: `CSS di luar Kelir: ${label}` });
      }
    }
  }

  for (const { spec, idx } of importsOf(src)) {
    if (spec === "tailwindcss" || spec.startsWith("tailwindcss/")) {
      findings.push({
        level: "error",
        line: lineAt(src, idx),
        msg: `impor Tailwind '${spec}': CSS konsumen haram`,
      });
      continue;
    }
    const uiPkg = packageMatches(spec, THIRD_PARTY_UI);
    if (uiPkg) {
      findings.push({
        level: "warn",
        line: lineAt(src, idx),
        msg: `impor UI pihak ketiga '${uiPkg}' di luar Kelir`,
      });
    }
    const canvasPkg = packageMatches(spec, CANVAS_LIBS);
    if (canvasPkg) {
      findings.push({
        level: "warn",
        line: lineAt(src, idx),
        msg: `library canvas/WebGL '${canvasPkg}' di luar Kelir`,
      });
    }
  }

  commit(f, src, findings);
}

const fmt = (x) => `${rel(x.f)}:${x.line}: ${x.msg}`;
console.log(`kelir-hunt: ${err.length} ERROR, ${warn.length} WARN, ${allowed.length} ALLOW`);
for (const a of allowed) console.log(`ALLOW ${rel(a.f)}:${a.line}: ${a.msg}`);
for (const w of warn) console.log(`WARN  ${fmt(w)}`);
for (const e of err) console.log(`ERROR ${fmt(e)}`);
console.log(
  `cakupan: ${scope.ui} file UI konsumen dipindai (${scope.outside} tanpa impor Kelir); ` +
    `dikecualikan: ${scope.kit} internal kit, ${scope.tests} test/fixture/story, ` +
    `${scope.generated} generated, ${scope.noJsx} tanpa JSX, ${scope.css} stylesheet konsumen.`,
);
if (STRICT && err.length > 0) process.exit(1);
