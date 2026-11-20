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
// review. Explicit exception: `kelir-allow: <reason>` per file.
//
// Scope (issue #116): a file whose name says it is not UI
// (*controller*, *action*, *queries*, *repository*, *service*, *server*, *db*,
// *schema*, *seed*, *migration*) is skipped and counted, because "UI without a
// Kelir import" on server code is noise. `--scope=views,app` restricts the scan
// to those src subdirectories; `--all-files` disables the name heuristic.
// WARN rules a project considers its own style can be listed in `.kelirrc`
// (suppressed findings are reported as ALLOW, never silent).
//
// Mode: --strict -> exit 1 when any ERROR. Default is report-only.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG_REASON, loadConfig, suppressedBy } from "./kelir-config.mjs";
import { parseAllowReason, printReport } from "./kelir-report.mjs";
import { TOOLS_VERSION } from "./kelir-version.mjs";

// scripts/ -> kelir/ -> views/ -> src/ -> <project>
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KELIR = join(SRC, "views", "kelir");
const STRICT = process.argv.includes("--strict");
const ALL_FILES = process.argv.includes("--all-files");
const NO_CONFIG = process.argv.includes("--no-config");
const scopeArg = process.argv.find((a) => a.startsWith("--scope="))?.slice("--scope=".length);
const SCOPE_DIRS = scopeArg
  ? scopeArg.split(",").map((s) => s.trim().replace(/^\/+|\/+$/g, "")).filter(Boolean)
  : null;
// Basename heuristic: server/logic modules, not UI (issue #116).
const NON_UI_RE =
  /(?:^|\/)(?:[^/]*-)?(?:controller|actions?|queries|query|repository|repo|services?|server|db|schema|seeds?|migrations?)[^/]*\.(?:tsx?|jsx?)$/i;

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

// TypeScript type keywords that appear as `<keyword>` in generic positions
// (`Record<string, x>`, `useState<void>()`). They start lowercase, so without
// this set the tag filter below reads them as intrinsic HTML tags and reports a
// `ui-outside` finding for a file that contains no JSX at all (issue #119).
// `object` is deliberately absent: `<object>` is a real HTML element.
const TS_TYPE_KEYWORDS = new Set([
  "any",
  "bigint",
  "boolean",
  "infer",
  "keyof",
  "never",
  "number",
  "readonly",
  "string",
  "symbol",
  "typeof",
  "unknown",
  "void",
]);

// JSX tags only: a `<` that directly follows a word character is a generic
// type argument (`Map<string, …>`), not an element. The following-character
// lookahead keeps the match to a real tag name.
const JSX_TAG_RE = /<([A-Za-z][\w.]*)(?=[\s/>])/g;
const JSX_FILE_RE = /\.(?:tsx|jsx)$/;

// Extracts JSX element tags from masked source. `.ts` files cannot contain JSX,
// so they yield no tags (issue #119: the old `/<[A-Za-z][\w.]*[\s/>]/` test read
// TS generics as intrinsic tags).
function jsxTags(masked, file) {
  if (!JSX_FILE_RE.test(file)) return [];
  const tags = [];
  for (const m of masked.matchAll(JSX_TAG_RE)) {
    const before = m.index === 0 ? "" : masked[m.index - 1];
    if (/[A-Za-z0-9_$]/.test(before)) continue;
    tags.push({ tag: m[1], idx: m.index });
  }
  return tags;
}

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

const scope = {
  ui: 0,
  outside: 0,
  kit: 0,
  tests: 0,
  generated: 0,
  noJsx: 0,
  css: 0,
  nonUi: 0,
  outOfScope: 0,
};
const err = [];
const warn = [];
const allowed = [];
const suppressed = [];

// Per-project WARN suppression (issue #116). A broken config is fatal.
const config = loadConfig({ enabled: !NO_CONFIG });
if (config.error) {
  console.error(`kelir-hunt: ${config.error}`);
  process.exit(2);
}
for (const note of config.invalid) console.error(`kelir-hunt: ignoring ${note}`);

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

// kelir-allow: <reason> anywhere in the file (the marker is file-scoped for
// hunt). Parsing lives in kelir-report.mjs so CRLF checkouts keep working
// (issue #118); the reported line is the marker line itself.
function allowReason(src) {
  const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const reason = parseAllowReason(lines[i]);
    if (reason) return { line: i + 1, reason };
  }
  return null;
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
    allowed.push({ f, line: allow.line, msg: `${findings.length} finding(s) - ${allow.reason}`, rule: "kelir-allow" });
    return;
  }
  for (const x of findings) {
    // A WARN rule listed in .kelirrc is reported as ALLOW (never hidden).
    if (x.level !== "error" && suppressedBy(config, "kelir-hunt", x.rule)) {
      suppressed.push({ f, line: x.line, msg: x.msg, rule: x.rule });
      continue;
    }
    (x.level === "error" ? err : warn).push({ f, line: x.line, msg: x.msg, rule: x.rule });
  }
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

  // Scope filters (issue #116): explicit --scope dirs, then the non-UI name
  // heuristic. Both only decide what is worth reporting, never what is legal.
  if (SCOPE_DIRS && !SCOPE_DIRS.some((dir) => relFromSrc === dir || relFromSrc.startsWith(`${dir}/`))) {
    scope.outOfScope++;
    continue;
  }
  if (!ALL_FILES && NON_UI_RE.test(relFromSrc)) {
    scope.nonUi++;
    continue;
  }

  const src = readFileSync(f, "utf8");
  const findings = [];

  if (CSS_RE.test(f)) {
    scope.css++;
    const tw = TAILWIND_RE.exec(src);
    if (tw) {
      findings.push({
        level: "error",
        line: lineAt(src, tw.index),
        rule: "consumer-css",
        msg: "Tailwind directive (@tailwind/@apply): consumer CSS is forbidden",
      });
    } else {
      findings.push({
        level: "warn",
        line: 1,
        rule: "consumer-stylesheet",
        msg: "consumer stylesheet outside Kelir; move to a token/kit or give a reason",
      });
    }
    commit(f, src, findings);
    continue;
  }

  const masked = blankNonCode(src);
  const tags = jsxTags(masked, f);
  if (tags.length === 0) {
    scope.noJsx++;
    continue;
  }

  const kelir = importsKelir(src);
  const route = isRoute(relFromSrc);
  const intrinsic = tags.filter(
    (t) =>
      /^[a-z]/.test(t.tag) &&
      !DOC_TAGS.has(t.tag) &&
      !TS_TYPE_KEYWORDS.has(t.tag),
  );
  scope.ui++;
  if (!kelir) scope.outside++;

  if (!kelir && route && intrinsic.length > 0) {
    findings.push({
      level: "error",
      line: 1,
      rule: "route-intrinsic",
      msg: `route UI uses intrinsic tags without a Kelir import: ${tagList(intrinsic.map((t) => t.tag))}`,
    });
  } else if (!kelir && !route && intrinsic.length > 0) {
    findings.push({
      level: "warn",
      line: 1,
      rule: "ui-outside",
      msg: `UI without a Kelir import (${intrinsic.length} intrinsic tags: ${tagList(intrinsic.map((t) => t.tag))})`,
    });
  }

  for (const tag of ["canvas", "iframe"]) {
    const hit = tags.find((t) => t.tag === tag);
    if (hit) {
      findings.push({
        level: "warn",
        line: lineAt(src, hit.idx),
        rule: "canvas-frame",
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
      findings.push({
        level: "warn",
        line: lineAt(src, idx),
        rule: "dynamic-content",
        msg: `dynamic content: ${label}; restrict/sanitize`,
      });
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
      findings.push({ level: "warn", line: lineAt(src, m.index), rule: "css-in-js", msg: `CSS outside Kelir: ${label}` });
    }
  }
  if (!kelir) {
    for (const [re, label] of [
      [/\bstyle\s*=\s*\{\{/, "inline style"],
      [/<style\b/, "<style> block"],
    ]) {
      const m = re.exec(masked);
      if (m) {
        findings.push({ level: "warn", line: lineAt(src, m.index), rule: "css-outside", msg: `CSS outside Kelir: ${label}` });
      }
    }
  }

  for (const { spec, idx } of importsOf(src)) {
    if (spec === "tailwindcss" || spec.startsWith("tailwindcss/")) {
      findings.push({
        level: "error",
        line: lineAt(src, idx),
        rule: "consumer-css",
        msg: `Tailwind import '${spec}': consumer CSS is forbidden`,
      });
      continue;
    }
    const uiPkg = packageMatches(spec, THIRD_PARTY_UI);
    if (uiPkg) {
      findings.push({
        level: "warn",
        line: lineAt(src, idx),
        rule: "third-party-ui",
        msg: `third-party UI import '${uiPkg}' outside Kelir`,
      });
    }
    const canvasPkg = packageMatches(spec, CANVAS_LIBS);
    if (canvasPkg) {
      findings.push({
        level: "warn",
        line: lineAt(src, idx),
        rule: "canvas-lib",
        msg: `canvas/WebGL library '${canvasPkg}' outside Kelir`,
      });
    }
  }

  commit(f, src, findings);
}

printReport({
  gate: "kelir-hunt",
  version: TOOLS_VERSION,
  status: err.length > 0 ? "FAIL" : "OK",
  counts: { error: err.length, warn: warn.length, allow: allowed.length + suppressed.length },
  rows: [
    ...allowed.map((a) => ({
      level: "ALLOW",
      location: `${rel(a.f)}:${a.line}`,
      rule: a.rule,
      message: a.msg,
      suggestion: "allowed by kelir-allow",
    })),
    ...suppressed.map((s) => ({
      level: "ALLOW",
      location: `${rel(s.f)}:${s.line}`,
      rule: s.rule,
      message: s.msg,
      suggestion: `${CONFIG_REASON} suppressed (config)`,
    })),
    ...warn.map((w) => ({
      level: "WARN",
      location: `${rel(w.f)}:${w.line}`,
      rule: w.rule,
      message: w.msg,
      suggestion: "use the Kelir equivalent",
    })),
    ...err.map((e) => ({
      level: "ERROR",
      location: `${rel(e.f)}:${e.line}`,
      rule: e.rule,
      message: e.msg,
      suggestion: "use the Kelir component",
    })),
  ],
  emptyText: "(no hunt violations)",
  scope: {
    "consumer UI files": scope.ui,
    "without kelir import": scope.outside,
    "kit-internal excluded": scope.kit,
    tests: scope.tests,
    generated: scope.generated,
    "without JSX": scope.noJsx,
    "consumer stylesheets": scope.css,
    "non-UI skipped": scope.nonUi,
    "out of --scope": scope.outOfScope,
    "warn suppressed (.kelirrc)": suppressed.length,
  },
});
if (STRICT && err.length > 0) process.exit(1);
