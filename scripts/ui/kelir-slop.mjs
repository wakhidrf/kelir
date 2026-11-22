// kelir-slop.mjs - anti-slop gate for the repo (F6).
//
// Scans SHIPPED code (consumers in <project>/src minus the kit, plus kit-internal
// minus mirror/vendor) using the matcher table in this file; the rule index is
// read from kelir-integration/antislop/index.json (upstream mirror).
// No new deps, no network.
//
// Semantics (deliberate, matching the upstream rulebook):
//   - code rules (jsx/css/comment) -> run against raw source.
//   - text rules (copy)            -> ONLY against string/JSX text shown to
//     users; code comments are not "copy" (upstream separates antislop-code).
//   - both rules (emoji)           -> both.
//   - Lines marked 'kelir-allow: <reason>' = explicit per-line exception (a
//     reason must be written in the comment), reported as ALLOW (not silent).
//
// Mode: --strict -> exit 1 when any ERROR. Scope is always printed.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { allowReasonNear, printReport } from "../kelir-report.mjs";
import { TOOLS_VERSION } from "../kelir-version.mjs";

// ui/ -> scripts/ -> kelir/ -> views/ -> src/ -> <project>
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KELIR = join(SRC, "views", "kelir");
const INTEGRATION = join(KELIR, "kelir-integration");
const STRICT = process.argv.includes("--strict");

// Gate matcher table. Each id MUST exist in index.json (fail-closed), so an
// upstream rule rename is caught instead of silently weakening the filter.
// scope: "text" = prose/copy (string/JSX text), "code" = jsx/css/comment,
// "both".
const MATCHERS = [
  // core rules
  { rule: "R-02", scope: "text", why: "em dash in written text; use a comma, period, colon, or parentheses", re: /[\u2014\u2013]/ },
  { rule: "R-16", scope: "text", why: "buzzword; say what the thing does instead", re: /\b(?:unlock|elevate|empower|delve|seamless|game[\s-]?changer|cutting[\s-]edge|revolutionary|next[\s-]gen|unleash|effortless|supercharge|skyrocket|transformative|world[\s-]class|best[\s-]in[\s-]class|industry[\s-]leading|state[\s-]of[\s-]the[\s-]art|leverage|synergy|paradigm|robust)\b/i },
  { rule: "R-17", scope: "text", why: "invented number; only claim figures you can back", re: /\b\d+(?:\.\d+)?\s?(?:%|x\b|percent)\b|\b\d{2,}(?:[,.]\d{3})*\+?\s+(?:users|customers|downloads|teams|companies|stars)\b/i },
  { rule: "R-36", scope: "text", why: "unverifiable claim or social proof", re: /\btrusted by\b|\bstudies show\b|\bused by (?:thousands|millions)\b/i },
  { rule: "R-39", scope: "code", why: "viewport disables zoom; keep pinch-zoom available", re: /\b(?:user-scalable\s*=\s*['"]?no|maximum-scale\s*=\s*['"]?1(?:\.0)?)\b/i },
  // ui
  { rule: "antislop-ui--generic-blue-purple-gradient", scope: "code", why: "default blue-purple gradient; pick a purposeful palette", re: /linear-gradient\([^)]*?(?:#6366f1|#8b5cf6|#a855f7|#7c3aed|#4f46e5|indigo|blueviolet)/i },
  { rule: "antislop-ui--excessive-glassmorphism", scope: "code", why: "glassmorphism for no reason", re: /backdrop-filter\s*:\s*[^;]*blur/i },
  { rule: "antislop-ui--excessive-border-radius", scope: "code", why: "oversized corner radius", re: /border-radius\s*:\s*(?:[2-9]\d{1,}|9{3,})px|border-radius\s*:\s*(?:999|9999)px/i },
  { rule: "antislop-ui--emoji-as-decoration", scope: "both", why: "decorative emoji", re: /(?![\u2713\u2714])[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u },
  // copywriting
  { rule: "antislop-copywriting--empty-ai-vocabulary", scope: "text", why: "empty AI vocabulary", re: /\b(?:pave the way|dive into|in the realm of|a tapestry of|when it comes to|it'?s worth noting)\b/i },
  { rule: "antislop-copywriting--significance-inflation", scope: "text", why: "inflated significance", re: /\b(?:stands as a testament|plays a (?:vital|crucial|pivotal) role|underscores the importance|a beacon of)\b/i },
  { rule: "antislop-copywriting--fabricated-specifics", scope: "text", why: "specific-looking number without a source", re: /\b\d+(?:\.\d+)?% of (?:users|developers|teams)\b/i },
  { rule: "antislop-copywriting--all-caps-emphasis", scope: "text", why: "ALL-CAPS emphasis", re: /\b(?!(?:API|CSS|HTML|JSON|UI|UX|MCP|URL|HTTP|ID|CTA|FAQ|SVG|TODO|REST|CLI|DOM|SSR|SEO|OK|MIT|MVC|JSX|TSX|MUI|RTL|LTR|ARIA|WCAG|OTP|CPU|IDR|E2E|SQL|SDK|PNG|STYLE|README|CHANGELOG|LICENSE|CRLF|DNS|TTL|CLS|SWR)\b)(?![0-9A-F]{3,}\b)[A-Z]{3,}\b/ },
  { rule: "antislop-copywriting--em-dashes", scope: "text", why: "em dash punctuation in copy", re: /\u2014/ },
  // human / a11y
  { rule: "antislop-human--removed-focus-outline", scope: "code", why: "focus outline removed; keyboard users lose the indicator", re: /outline\s*:\s*['"]?(?:none|0)\b/i },
  // layoutmobile
  { rule: "antislop-layoutmobile--100vh-sections", scope: "code", why: "100vh section; use dynamic units / min-height correctly", re: /\b100vh\b/ },
  { rule: "antislop-layoutmobile--fixed-pixel-type", scope: "code", why: "fixed px font size; use relative units", re: /font-size\s*:\s*\d+px/i },
  // code comments
  { rule: "antislop-code--decorative-separators", scope: "code", why: "banner comment made of repeated characters", re: /(?:\/\/|#|\/\*|\{\/\*)[^\S\n]*[=\-*~_]{4,}/ },
  { rule: "antislop-code--restating-the-obvious", scope: "code", why: "comment restates the code", re: /\/\/\s*(?:initialize|set up|process|validate the|handle the|loop through|return the|define the)\b/i },
];

function loadRuleMap(mirror) {
  const index = JSON.parse(readFileSync(join(mirror, "index.json"), "utf8"));
  const map = new Map();
  for (const r of index.core.rules) {
    map.set(r.id, { kind: "rule", id: r.id, title: r.title, skill: "antislop", target: "core", severity: r.severity, line: r.line });
  }
  for (const s of index.skills) {
    for (const sec of s.sections) {
      for (const p of sec.patterns) {
        map.set(p.id, { kind: "pattern", id: p.id, title: p.name, skill: s.name, target: s.target, line: p.line });
      }
    }
  }
  for (const m of MATCHERS) {
    if (!map.has(m.rule)) {
      throw new Error(
        `kelir-slop: matcher rule '${m.rule}' is not in index.json (rule changed?).`,
      );
    }
  }
  return map;
}

const CODE_EXT = /\.(tsx?|jsx?|mjs|cjs|css)$/;
const TEST_EXT = /\.(test|test-d)\.(tsx?|jsx?)$/;
// Generated / vendored: not ours to edit.
const GENERATED = [
  join(INTEGRATION, "antislop"), // upstream mirror (do not touch)
  join(SRC, "views", "kelir-docs.ts"), // from README/CHANGELOG
];
// Spec files: carry their own rulebook / slop corpus to test the gate.
const SPEC = [
  join(KELIR, "scripts", "ui", "kelir-slop.mjs"), // this gate (matcher table + literal allow)
];

// Kit-internal code is the IMPLEMENTATION (e.g. outline:none + its own ring,
// glassmorphism theme, pill radius): the code/ui/mobile/a11y rules here are
// false positives by design. Still checked: copy (user-facing text),
// decorative emoji, and comment hygiene.
const kitAllows = (m) => m.scope === "text" || m.scope === "both" || m.rule.startsWith("antislop-code--");

if (!existsSync(SRC)) {
  console.error(
    "kelir-slop: could not find <project>/src at " +
      `${SRC}.\n` +
      "  Run from a consumer project that places the kit at src/views/kelir\n" +
      "  (e.g. `npm run kelir`), not from the kit repo itself.",
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

// User-facing text: literal contents '...' "..." `...` (literal template
// parts only) + JSX text nodes (outside {expression}).
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
    // sq | dq | tpl: collect literal contents.
    if (c === "\\") { i += 2; continue; }
    const q = s === "sq" ? "'" : s === "dq" ? '"' : "`";
    if (c === q) { spans.push({ start: cur().start, end: i }); st.pop(); i++; continue; }
    if (s === "tpl" && two === "${") { spans.push({ start: cur().start, end: i }); st.push({ t: "tplExpr", d: 1 }); i += 2; continue; }
    i++;
  }
  return spans;
}

// JSX text nodes: text between '>' and '<' at bracket depth 0.
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

// Strings that clearly look like code/values (className, style, utility token) are not copy.
function looksLikeCode(text) {
  if (!/[A-Za-z]/.test(text)) return true;
  if (/[{};]/.test(text)) return true;
  if (/^[-\w/.:#%()[\]]+$/.test(text.trim())) return true;
  return false;
}

const RULES = loadRuleMap(join(INTEGRATION, "antislop"));
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
  const lines = src.split(/\r?\n/);
  // Parsing lives in kelir-report.mjs so CRLF checkouts keep working (issue #118).
  const allowedLine = (ln) => allowReasonNear(lines, ln) !== null;
  const hits = [];

  // Code rules (and "both") against the raw source.
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

  // Copy rules against user-facing text.
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

  // Dedupe rule+line; em dash (R-02) absorbs its copywriting variants.
  const seen = new Set();
  const dashLines = new Set(hits.filter((h) => h.rule === "R-02").map((h) => h.line));
  for (const h of hits) {
    if (h.rule === "antislop-copywriting--em-dashes" && dashLines.has(h.line)) continue;
    const key = `${h.rule}@${h.line}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const meta = RULES.get(h.rule) ?? {};
    const entry = { f, ...h, target: meta.target ?? "", severity: meta.severity ?? null };
    if (allowedLine(h.line)) allowed.push(entry);
    else err.push(entry);
  }
}

printReport({
  gate: "kelir-slop",
  version: TOOLS_VERSION,
  status: err.length > 0 ? "FAIL" : "OK",
  counts: { error: err.length, warn: 0, allow: allowed.length },
  rows: [
    ...allowed.map((a) => ({
      level: "ALLOW",
      location: `${rel(a.f)}:${a.line}`,
      rule: a.rule,
      message: `${a.target || "core"} - ${a.excerpt}`,
      suggestion: "allowed by kelir-allow",
    })),
    ...err.map((e) => ({
      level: "ERROR",
      location: `${rel(e.f)}:${e.line}`,
      rule: e.rule,
      message: `${e.target || "core"} - ${e.excerpt}`,
      suggestion: "rewrite with the Kelir meaning",
    })),
  ],
  emptyText: "(no anti-slop violations)",
  scope: {
    "consumer files": coverage.consumer,
    "kit files": coverage.kit,
    "tests skipped": coverage.tests,
    "without kelir import": coverage.noImport,
    "generated/vendor": GENERATED.length,
    "spec/corpus": SPEC.length,
  },
});
if (STRICT && err.length > 0) process.exit(1);
