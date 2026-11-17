// kelir-hunt.mjs - adoption gate: find UI/UX outside Kelir.
//
// Guard only checks files that IMPORT Kelir. Hunt complements it:
//   - routes (app/pages) rendering intrinsic tags without a Kelir import = ERROR
//   - non-route components with intrinsic tags without Kelir = WARN (inventory)
//   - canvas/iframe, dynamic content, CSS-in-JS, consumer stylesheets, and
//     third-party UI library imports = WARN
//   - Tailwind directives (@tailwind/@apply) = ERROR
//
// Hunt only sees static signals, not render output: "100% Kelir" still needs
// review. Explicit exception: `kelir-allow: hunt <reason>` per file.
//
// Mode: --strict -> exit 1 when any ERROR. Default is report-only.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// scripts/ -> kelir/ -> views/ -> src/ -> <project>
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
// HTML document tags, not app UI (html/body required in the root Next.js layout).
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

// UI libraries outside the Kelir stack (MUI/emotion intentionally NOT listed).
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
    "kelir-hunt: could not find <project>/src at " +
      `${SRC}.\n` +
      "  Run from a consumer project that places the kit at src/views/kelir\n" +
      "  (e.g. `npm run kelir:hunt`), not from the kit repo itself.",
  );
  process.exit(2);
}

const rel = (p) => relative(ROOT, p).replace(/\\/g, "/");
const lineAt = (src, idx) => (idx < 0 ? 1 : src.slice(0, idx).split("\n").length);
// `kelir-docs.ts` must not be treated as kit-internal just because of its name prefix.
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

// Blank comments + string/regex contents so signals come only from code.
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
  return { line: lineAt(src, m.index), reason: m[1].trim() || "no reason" };
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
    allowed.push({ f, line: allow.line, msg: `${findings.length} finding(s) - ${allow.reason}` });
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
        msg: "Tailwind directive (@tailwind/@apply): consumer CSS is forbidden",
      });
    } else {
      findings.push({
        level: "warn",
        line: 1,
        msg: "consumer stylesheet outside Kelir; move to a token/kit or give a reason",
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
      msg: `route UI uses intrinsic tags without a Kelir import: ${tagList(intrinsic.map((t) => t.tag))}`,
    });
  } else if (!kelir && !route && intrinsic.length > 0) {
    findings.push({
      level: "warn",
      line: 1,
      msg: `UI without a Kelir import (${intrinsic.length} intrinsic tags: ${tagList(intrinsic.map((t) => t.tag))})`,
    });
  }

  for (const tag of ["canvas", "iframe"]) {
    const hit = tags.find((t) => t.tag === tag);
    if (hit) {
      findings.push({
        level: "warn",
        line: lineAt(src, hit.idx),
        msg: `<${tag}> outside a Kelir component; wrap it + give a reason`,
      });
    }
  }

  const sinks = [
    ["dangerouslySetInnerHTML", "raw HTML via dangerouslySetInnerHTML"],
    ["innerHTML", "innerHTML manipulation"],
    ["outerHTML", "outerHTML manipulation"],
    ["ReactMarkdown", "markdown render (react-markdown)"],
    ["MDXContent", "dynamic mdx render"],
  ];
  for (const [needle, label] of sinks) {
    const idx = masked.indexOf(needle);
    if (idx !== -1) {
      findings.push({ level: "warn", line: lineAt(src, idx), msg: `dynamic content: ${label}; restrict/sanitize` });
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
      findings.push({ level: "warn", line: lineAt(src, m.index), msg: `CSS outside Kelir: ${label}` });
    }
  }
  if (!kelir) {
    for (const [re, label] of [
      [/\bstyle\s*=\s*\{\{/, "inline style"],
      [/<style\b/, "<style> block"],
    ]) {
      const m = re.exec(masked);
      if (m) {
        findings.push({ level: "warn", line: lineAt(src, m.index), msg: `CSS outside Kelir: ${label}` });
      }
    }
  }

  for (const { spec, idx } of importsOf(src)) {
    if (spec === "tailwindcss" || spec.startsWith("tailwindcss/")) {
      findings.push({
        level: "error",
        line: lineAt(src, idx),
        msg: `Tailwind import '${spec}': consumer CSS is forbidden`,
      });
      continue;
    }
    const uiPkg = packageMatches(spec, THIRD_PARTY_UI);
    if (uiPkg) {
      findings.push({
        level: "warn",
        line: lineAt(src, idx),
        msg: `third-party UI import '${uiPkg}' outside Kelir`,
      });
    }
    const canvasPkg = packageMatches(spec, CANVAS_LIBS);
    if (canvasPkg) {
      findings.push({
        level: "warn",
        line: lineAt(src, idx),
        msg: `canvas/WebGL library '${canvasPkg}' outside Kelir`,
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
  `scope: ${scope.ui} consumer UI files scanned (${scope.outside} without a Kelir import); ` +
    `excluded: ${scope.kit} kit-internal, ${scope.tests} test/fixture/story, ` +
    `${scope.generated} generated, ${scope.noJsx} without JSX, ${scope.css} consumer stylesheet.`,
);
if (STRICT && err.length > 0) process.exit(1);
