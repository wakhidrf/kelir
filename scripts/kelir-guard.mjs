// kelir-guard.mjs — P1a STYLE.md: patent-contract guard with no new deps.
// Lives in the kit repo (src/views/kelir/scripts) so it travels when the kit
// is imported into other projects (the kit always lives at
// <project>/src/views/kelir).
// Mode: --strict (exit 1 on ERROR) vs default warn (exit 0 + report).
// Scope: consumers (src minus src/views/kelir) + kelir-components (hardcode).
// Precision (2026-10-11, STYLE §9): (a) intrinsic + className ONLY is not a
// cue — consumer-CSS (a class stylesheet owned by the app) is the official
// pattern (§8-P0/P1); remaining cues target inline style (the real escape
// hatch). (b) data-kelir-* is excluded from the data-* check (kit-owned
// namespace = wiring the Provider contract from kelir-styles, not a slot
// leak).
// F9 (2026-10-19, owner decision): "zero consumer CSS" — className on
// intrinsics, non-kit <style> blocks, and intrinsic layout/text tags = ERROR
// (recorded exception: html/body in src/app/layout.tsx + a <style> block
// containing imported kit CSS). Non-kit consumer <style> blocks = ERROR
// since F9b; className on intrinsics + intrinsic layout/text tags = WARN
// inventory (becomes ERROR in F9e after the F9c migration). STYLE §3/§9(a)
// revised accordingly.
// Syntax (2026-10-11, issue #27): the consumer check rises to syntax level —
// comments + string/regex contents are blanked first, then JSX tags are
// scanned across lines (multi-line style={{...}} no longer slips through).
// P0 of issue #110 is already covered: scanning runs over the whole blanked
// source, so tags inside expression containers ({cond && <div />}) are
// detected too. Component-prop rules are limited to the contract names in
// kelir-types.ts (aligned with GritQL; app-owned components = app business,
// not contract). Scope exceptions are printed explicitly in the report (not
// silent).
// Issue #114: every error carries a rule id and a concrete replacement
// suggestion (the token/component to use), and `--explain <rule>` prints the
// rule summary + docs link + the files it affects (run it with no rule to list
// every rule).
// Issue #116: `--fix` rewrites the deterministic raw-tag -> kit component
// mappings (only tags whose attributes the kit component accepts), `--dry-run`
// previews them, and `.kelirrc` suppresses WARN rules a project considers its
// own style (suppressed findings are reported as ALLOW, never silent).
// Version: see kelir-version.mjs (bump the minor on rule changes that add
// errors, so consumers can pin a known-good kit tag).
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG_REASON, loadConfig, suppressedBy } from "./kelir-config.mjs";
import { TOOLS_VERSION } from "./kelir-version.mjs";
import { BOLD, RESET, printReport, printTable } from "./kelir-report.mjs";

// scripts/ -> kelir/ -> views/ -> src/ -> <project>
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KELIR = join(SRC, "views", "kelir");
const KELIR_COMP = join(KELIR, "kelir-components");
const STRICT = process.argv.includes("--strict");
const FIX = process.argv.includes("--fix");
const DRY_RUN = process.argv.includes("--dry-run");
const NO_CONFIG = process.argv.includes("--no-config");

const ALLOW_FILES = new Set(["kelir-styles.ts", "kelir-variants.ts"]);
const BANNED_PROPS = ["style", "sx", "className", "slotProps", "classes", "components", "componentsProps", "slot"];

// Rule catalog for --explain (issue #114). Each error carries a rule id; the
// suggestion names the concrete token/component to use.
const DOCS = "https://github.com/wakhidrf/kelir/blob/main/README.md";
const RULES = {
  "raw-tag": {
    summary: "Raw intrinsic layout/text tags are forbidden; render a kit component.",
    docs: `${DOCS}#5-usage-rules`,
  },
  className: {
    summary: "className on an intrinsic is consumer CSS (§3); use a kit component.",
    docs: `${DOCS}#5-usage-rules`,
  },
  style: {
    summary: "Inline style is consumer styling (§3); visuals belong to the kit.",
    docs: `${DOCS}#5-usage-rules`,
  },
  "heuristic-slot": {
    summary:
      "Heuristic only: an intrinsic with inline style inside a kelir-importing file is a slot candidate, not proof.",
    docs: `${DOCS}#5-usage-rules`,
  },
  "banned-prop": {
    summary:
      "Style-escape props (style/sx/className/slotProps/classes/components/slot) are outside the contract.",
    docs: `${DOCS}#5-usage-rules`,
  },
  "consumer-style": {
    summary: "Consumer <style> blocks are forbidden (§3); use a kit prop or the theme.",
    docs: `${DOCS}#5-usage-rules`,
  },
  "data-attr": {
    summary: "data-* is not a styling hook (only data-testid is allowed).",
    docs: `${DOCS}#5-usage-rules`,
  },
  "mui-override": {
    summary: "Global .Mui* overrides outside the kit are forbidden (§3b).",
    docs: `${DOCS}#5-usage-rules`,
  },
  "kelir-selector": {
    summary:
      "Selectors prefixed .kelir-* are kit-internal (§3b); do not target them from an app.",
    docs: `${DOCS}#anti-slop-rulebook-for-ai-assistants`,
  },
  hex: {
    summary: "Hardcoded hex colors are forbidden; use a css.* color token.",
    docs: `${DOCS}#anti-slop-rulebook-for-ai-assistants`,
  },
  rgba: {
    summary: "Hardcoded rgb()/rgba() colors are forbidden; use a css.* color token.",
    docs: `${DOCS}#anti-slop-rulebook-for-ai-assistants`,
  },
  "box-shadow": {
    summary: "Raw box-shadow is forbidden; use css.shadows.* (card/convex/concave).",
    docs: `${DOCS}#anti-slop-rulebook-for-ai-assistants`,
  },
  "font-family": {
    summary: "Raw font-family is forbidden; the active theme owns typography.",
    docs: `${DOCS}#anti-slop-rulebook-for-ai-assistants`,
  },
  "layout-interim": {
    summary:
      "Token-wrapper layout is superseded by kit layout primitives (§8-P1b).",
    docs: `${DOCS}#5-usage-rules`,
  },
};

// Tag -> the kit component(s) that replace it (issue #114 actionable errors).
const TAG_KIT = {
  div: "Stack / Container / PageFrame",
  section: "Container / Stack",
  main: "PageFrame",
  header: "PageFrame (header slot) / TopBar",
  footer: "PageFrame (footer slot)",
  nav: "Sidebar / NavigationMenu / TopBar",
  article: "Card",
  aside: 'Grid template="aside" / Sidebar',
  span: "Typography",
  p: "Typography",
  h1: "Typography",
  h2: "Typography",
  h3: "Typography",
  h4: "Typography",
  h5: "Typography",
  h6: "Typography",
  ul: "List",
  ol: "List",
  li: "List",
  blockquote: "Quote",
  figure: "Image",
  figcaption: "Image",
  hr: "Separator",
  table: "Table / DataTable",
  thead: "Table / DataTable",
  tbody: "Table / DataTable",
  tfoot: "Table / DataTable",
  tr: "Table / DataTable",
  td: "Table / DataTable",
  th: "Table / DataTable",
  caption: "Table / DataTable",
  colgroup: "Table / DataTable",
  col: "Table / DataTable",
  form: "Field / Questionnaire",
  fieldset: "Field / Questionnaire",
  legend: "Field / Questionnaire",
  button: "Button / IconButton",
  label: "Label / Field",
  a: "Link",
  input: "Input",
  select: "Select / NativeSelect",
  textarea: "Textarea",
  option: "Select / NativeSelect options",
  optgroup: "Select / NativeSelect options",
  img: "Image",
};

// Deterministic raw-tag -> kit component rewrites for `--fix` (issue #116).
// A tag is rewritten only when every attribute it carries in the file is
// accepted by the kit component, it has the component's required props, and
// (for children: string components) its children are plain text. Anything else
// stays an ERROR so the consumer decides; the report lists what was skipped.
const TYPOGRAPHY_ATTRS = [
  "variant", "variantMd", "variantMobile", "tone", "font", "as", "level",
  "align", "truncate", "breakAll", "tracking", "segments", "id", "aria-label",
];
const TEXT_VARIANTS = { h1: "h1", h2: "h2", h3: "h3" };
const FIX_TAGS = {
  input: {
    component: "Input",
    attrs: ["value", "defaultValue", "onChange", "placeholder", "type", "disabled", "size", "id", "aria-label"],
    void: true,
  },
  textarea: {
    component: "Textarea",
    attrs: ["label", "error", "helperText", "value", "defaultValue", "onChange", "placeholder", "rows", "disabled", "id", "aria-label"],
    void: true,
  },
  button: {
    component: "Button",
    attrs: ["children", "startIcon", "endIcon", "endContent", "variant", "align", "size", "onClick", "type", "disabled", "id", "aria-label"],
    textOnly: true,
  },
  label: {
    component: "Label",
    attrs: ["htmlFor", "id", "aria-label"],
    textOnly: true,
  },
  a: { component: "Link", attrs: ["href", "external", "icon", "id", "aria-label"], requires: ["href"] },
  img: { component: "Image", attrs: ["src", "alt", "height", "fluid", "maxHeight", "maxWidth", "fit", "radius", "fill", "priority", "id", "aria-label"], requires: ["src"], void: true },
  hr: { component: "Separator", attrs: ["label", "orientation", "id", "aria-label"], void: true },
  blockquote: { component: "Quote", attrs: ["variant", "align", "id", "aria-label"] },
};
for (const tag of ["p", "span", "h1", "h2", "h3"]) {
  const variant = TEXT_VARIANTS[tag];
  FIX_TAGS[tag] = {
    component: "Typography",
    attrs: TYPOGRAPHY_ATTRS,
    insert: ` as="${tag}"${variant ? ` variant="${variant}"` : ""}`,
  };
}

function explainTarget() {
  const i = process.argv.indexOf("--explain");
  if (i !== -1) return process.argv[i + 1] ?? "";
  const eq = process.argv.find((a) => a.startsWith("--explain="));
  return eq ? eq.slice("--explain=".length) : null;
}

const explain = explainTarget();
if (explain === "") {
  console.log(`kelir-guard v${TOOLS_VERSION}`);
  console.log("");
  printTable(
    [
      { key: "rule", label: "RULE" },
      { key: "summary", label: "SUMMARY" },
    ],
    Object.entries(RULES).map(([rule, meta]) => ({
      rule,
      summary: meta.summary,
    })),
  );
  console.log("");
  console.log(
    "Suppress a warn rule per project in .kelirrc: " +
      '{ "kelir-guard": { "warn": ["style"] } }',
  );
  process.exit(0);
}
if (explain !== null && !RULES[explain]) {
  console.error(`kelir-guard: unknown rule '${explain}'.`);
  console.error(`Available rules: ${Object.keys(RULES).join(", ")}`);
  process.exit(2);
}

// A specific `--explain <rule>` reports the files the rule affects, so it runs
// after the scan below.
function printExplain(rule) {
  console.log(`kelir-guard v${TOOLS_VERSION}`);
  console.log("");
  printTable(
    [
      { key: "field", label: "FIELD" },
      { key: "value", label: "VALUE" },
    ],
    [
      { field: "rule", value: rule },
      { field: "summary", value: RULES[rule].summary },
      { field: "docs", value: RULES[rule].docs },
      { field: "severity", value: ruleSeverity(rule) },
    ],
  );

  const hits = [...err, ...warn].filter((e) => e.rule === rule);
  const byFile = new Map();
  for (const hit of hits) {
    const key = rel(hit.file);
    byFile.set(key, (byFile.get(key) ?? 0) + 1);
  }
  console.log("");
  console.log(BOLD + "Affected files" + RESET);
  printTable(
    [
      { key: "location", label: "LOCATION" },
      { key: "findings", label: "FINDINGS" },
    ],
    [...byFile].map(([location, findings]) => ({ location, findings })),
    "(no file is affected)",
  );

  if (rule === "raw-tag") {
    const byTag = new Map();
    for (const hit of hits) {
      const tag = /<([a-z][\w]*)>/.exec(hit.msg)?.[1];
      if (tag) byTag.set(tag, (byTag.get(tag) ?? 0) + 1);
    }
    console.log("");
    console.log(BOLD + "Tag map" + RESET);
    printTable(
      [
        { key: "tag", label: "TAG" },
        { key: "findings", label: "FINDINGS" },
        { key: "kit", label: "USE" },
        { key: "fixable", label: "--fix" },
      ],
      [...byTag].map(([tag, findings]) => ({
        tag: `<${tag}>`,
        findings,
        kit: TAG_KIT[tag] ?? "a kit component",
        fixable: FIX_TAGS[tag] ? "yes" : "manual",
      })),
      "(no raw tags)",
    );
  }
  process.exit(0);
}

// Rule id -> ERROR/WARN, so --explain never guesses the severity.
function ruleSeverity(rule) {
  for (const w of warn) if (w.rule === rule) return "WARN";
  for (const e of err) if (e.rule === rule) return "ERROR";
  return Object.hasOwn(RULES, rule) ? "no current finding" : "unknown";
}

// F9 (STYLE §3, owner decision 2026-10-19): "zero consumer CSS". Intrinsic
// layout/text tags that already have a kit component = ERROR; one recorded
// exception: html/body in src/app/layout.tsx (a Next.js requirement).
const RAW_TAGS = new Set([
  "div", "section", "main", "header", "footer", "nav", "article", "aside",
  "span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
  "blockquote", "figure", "figcaption", "hr",
  // Tables and interactive controls are also required to use the kit. `strong`/`em`/`b`/`i`
  // are deliberately left out for now: the kit has no bold/italic text
  // component yet, and the Markdown parser uses those inline elements for
  // semantics (issue #110).
  "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption",
  "colgroup", "col", "form", "fieldset", "legend", "button", "label",
  "a", "input", "select", "textarea", "option", "optgroup", "img",
]);
const EXEMPT_FILES = new Set(["src/app/layout.tsx"]);


// Contract component names (single source kelir-types.ts — same derivation as
// check-grit-sync): prop rules apply only to these names.
const KELIR_NAMES = new Set(
  [...readFileSync(join(KELIR, "kelir-types.ts"), "utf8").matchAll(/^export interface (\w+)Props/gm)].map(
    (m) => (m[1] === "KelirProviderProps" ? "KelirProvider" : m[1].replace(/Props$/, "")),
  ),
);

// Explicit scope: computed at run time, printed in the report (§8-P0/P1:
// official exclusions must be visible, not silent).
const scope = { scanned: 0, kitInternal: 0, noImport: 0, suppressed: 0 };
const allowed = [];
const suppressed = [];
const sourceCache = new Map();

// Per-project WARN suppression (issue #116): .kelirrc in the project root.
// A broken config is fatal (exit 2) so a typo cannot silently disable rules.
const config = loadConfig({ enabled: !NO_CONFIG });
if (config.error) {
  console.error(`kelir-guard: ${config.error}`);
  process.exit(2);
}
for (const note of config.invalid) console.error(`kelir-guard: ignoring ${note}`);

// kelir-allow: <reason> on the flagged line or up to 2 lines above it.
function allowReason(file, line) {
  let src = sourceCache.get(file);
  if (src === undefined) {
    try {
      src = readFileSync(file, "utf8");
    } catch {
      src = "";
    }
    sourceCache.set(file, src);
  }
  const lines = src.split("\n");
  for (let i = line; i >= Math.max(1, line - 2); i--) {
    const m = /kelir-allow:\s*(.*)$/.exec(lines[i - 1] ?? "");
    if (m && m[1].trim()) return m[1].trim();
  }
  return null;
}

// Preflight (issue #72): the guard assumes the kit lives at
// <project>/src/views/kelir. When run from the kit repo checkout itself
// (no <project>/src), it fails with a clear message instead of a vague ENOENT.
if (!existsSync(SRC)) {
  console.error(
    "kelir-guard: could not find <project>/src at " +
      `${SRC}.\n` +
      "  Run from a consumer project that places the kit at src/views/kelir\n" +
      "  (e.g. `npm run kelir:guard`), not from the kit repo itself.",
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
// --fix bookkeeping (issue #116).
const fixes = [];
const skips = [];
const rewritten = new Set();
const planned = new Set();
const add = (list, file, line, msg, rule, suggestion) => {
  const reason = allowReason(file, line);
  if (reason) {
    allowed.push({ file, line, msg, rule, suggestion, reason });
    return;
  }
  // A WARN rule listed in .kelirrc is reported as ALLOW (never hidden).
  if (list === warn && suppressedBy(config, "kelir-guard", rule)) {
    suppressed.push({ file, line, msg, rule, suggestion, reason: CONFIG_REASON });
    return;
  }
  list.push({ file, line, msg, rule, suggestion });
};

function lineNo(src, idx) { return src.slice(0, idx).split("\n").length; }

// 1+2. Consumer: files outside kelir that import kelir-* + banned props.
// Syntax level (issue #27): blank comments + string/regex contents first
// (length + newlines preserved → exact line numbers), then scan JSX tags
// across lines. The old single-line pattern slipped through for multi-line
// style={{...}} — that is what this fixes.
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
    // sq | dq | tpl: blank the content, keep the delimiters.
    if (c === "\\") { out[i] = " "; out[i + 1] = " "; i += 2; continue; }
    const q = s === "sq" ? "'" : s === "dq" ? '"' : "`";
    if (c === q) { out[i] = c; st.pop(); i++; continue; }
    if (s === "tpl" && two === "${") { out[i] = "$"; out[i + 1] = "{"; i += 2; st.push({ t: "tplExpr", d: 1 }); continue; }
    out[i] = c === "\n" ? "\n" : " ";
    i++;
  }
  return out.join("");
}

// Scan JSX tags on the blanked source: returns [{tag, attrs:[{name, idx}]}].
// Attributes are read up to the closing '>' at bracket depth 0 → tolerates
// multi-line + nested expressions; strings are blanked so '"' is safe.
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
    // Attributes only at depth 0: nested JSX inside an expression
    // (e.g. items={[{content: (<div className=...>)}]}) must not be
    // attributed to the outer tag.
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
    hits.push({
      tag,
      attrs,
      index: m.index,
      end,
      span: blank.slice(m.index, end + 1),
      selfClosing: /\/\s*>$/.test(blank.slice(m.index, end + 1)),
    });
  }
  return hits;
}

// --- Issue #116: deterministic raw-tag -> kit component fixes -------------
const IMPORT_BASE = "@/views/kelir/kelir-components";
const importSpec = (component) => `${IMPORT_BASE}/${component.toLowerCase()}`;

// null = safe to rewrite; a string = why it is left to the consumer.
function fixBlockReason(occ, spec) {
  if (spec.void && !occ.selfClosing) return "not self-closing";
  const span = occ.span ?? "";
  if (/\{\s*\.\.\./.test(span)) return "spread props";
  const names = new Set(occ.attrs.map((a) => a.name));
  for (const name of names)
    if (!spec.attrs.includes(name)) return `unsupported attribute '${name}'`;
  for (const name of spec.requires ?? [])
    if (!names.has(name)) return `missing required attribute '${name}'`;
  return null;
}

// Plan one tag's rewrites. All-or-nothing per tag: a single unsafe occurrence
// keeps every occurrence of that tag as an ERROR for manual review.
function planTagFix(tag, occurrences, src, blank) {
  const spec = FIX_TAGS[tag];
  const edits = [];
  const lines = [];
  for (const occ of occurrences) {
    const reason = fixBlockReason(occ, spec);
    if (reason) return { reason: `${reason} (line ${lineNo(src, occ.index)})` };
    if (!spec.void) {
      const close = blank.indexOf(`</${tag}`, occ.end + 1);
      if (close === -1) return { reason: `unclosed <${tag}> (line ${lineNo(src, occ.index)})` };
      if (spec.textOnly && /[<{]/.test(src.slice(occ.end + 1, close)))
        return { reason: `children are not plain text (line ${lineNo(src, occ.index)})` };
      edits.push({ start: close, end: close + 2 + tag.length, text: `</${spec.component}` });
    }
    edits.push({
      start: occ.index,
      end: occ.index + 1 + tag.length,
      text: `<${spec.component}${spec.insert ?? ""}`,
    });
    lines.push(lineNo(src, occ.index));
  }
  return { edits, lines };
}

// Add `name` to an existing named import of `spec`, or insert a new one.
function injectImport(src, name, spec) {
  const importRe = /^import\s+([^;]*?)\s+from\s+["']([^"']+)["'];?/gm;
  let lastEnd = 0;
  let named = null;
  let m;
  while ((m = importRe.exec(src)) !== null) {
    lastEnd = importRe.lastIndex;
    if (m[2] !== spec) continue;
    const clause = m[1].trim();
    if (/^type\s/.test(clause) || !clause.includes("{")) continue;
    named = m;
  }
  if (named) {
    const open = named[0].indexOf("{");
    const close = named[0].indexOf("}", open);
    const inner = named[0].slice(open + 1, close);
    const names = new Set(
      inner
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => part.split(/\s+as\s+/)[0].trim()),
    );
    if (names.has(name)) return src;
    const prefix = inner.trim() === "" || /,\s*$/.test(inner) ? " " : ", ";
    const at = named.index + close;
    return src.slice(0, at) + prefix + name + src.slice(at);
  }
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  const line = `import { ${name} } from "${spec}";`;
  return lastEnd > 0
    ? `${src.slice(0, lastEnd)}${eol}${line}${src.slice(lastEnd)}`
    : `${line}${eol}${src}`;
}

// Rewrite every deterministic raw tag in one file. Returns the applied tags,
// the tags left to the consumer, and the new source.
function applyFixes(src, blank, tags) {
  const groups = new Map();
  for (const hit of tags) {
    if (!Object.hasOwn(FIX_TAGS, hit.tag)) continue;
    const list = groups.get(hit.tag) ?? [];
    list.push(hit);
    groups.set(hit.tag, list);
  }

  const edits = [];
  const applied = [];
  const skipped = [];
  const components = new Set();
  for (const [tag, occurrences] of groups) {
    const plan = planTagFix(tag, occurrences, src, blank);
    if (plan.reason) {
      skipped.push({ tag, reason: plan.reason, count: occurrences.length });
      continue;
    }
    edits.push(...plan.edits);
    components.add(FIX_TAGS[tag].component);
    applied.push({
      tag,
      component: FIX_TAGS[tag].component,
      count: occurrences.length,
      line: plan.lines[0],
    });
  }
  if (edits.length === 0) return { applied, skipped, next: src };

  edits.sort((a, b) => b.start - a.start);
  let next = src;
  for (const edit of edits) next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
  for (const component of components) next = injectImport(next, component, importSpec(component));
  return { applied, skipped, next };
}

for (const f of walk(SRC)) {
  if (inKelir(f)) { if (/\.(tsx|jsx)$/.test(f)) scope.kitInternal++; continue; }
  if (!/\.(tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  if (!/from\s+["'][^"']*kelir[^"']*["']/.test(src) && !/from\s+["']@\/views\/kelir/.test(src)) { scope.noImport++; continue; }
  scope.scanned++;
  // Identifiers imported from kelir (validates kit-owned <style>).
  const kelirImports = new Set();
  for (const im of src.matchAll(/import\s+([\s\S]*?)\s+from\s+["'][^"']*kelir[^"']*["']/g)) {
    const def = /^\s*([A-Za-z_$][\w$]*)/.exec(im[1]);
    if (def) kelirImports.add(def[1]);
    const braces = /\{([^}]*)\}/.exec(im[1]);
    if (braces)
      for (const part of braces[1].split(",")) {
        const name = part.trim().split(/\s+as\s+/).pop().trim();
        if (name) kelirImports.add(name);
      }
  }
  const exempt = EXEMPT_FILES.has(rel(f));
  const blank = blankNonCode(src);
  const tags = scanJsxTags(blank);
  for (const { tag, attrs, index } of tags) {
    const base = tag.split(".")[0];
    const isKelir = KELIR_NAMES.has(base);
    const intrinsic = /^[a-z]/.test(tag);
    for (const { name, idx } of attrs) {
      if (/^[A-Z]/.test(tag) && isKelir && BANNED_PROPS.includes(name))
        add(
          warn,
          f,
          lineNo(src, idx),
          `banned prop '${name}' on component (needs review: Kelir?)`,
          "banned-prop",
          `remove '${name}'; visuals belong to the kit component`,
        );
      else if (intrinsic && name === "className")
        add(
          err,
          f,
          lineNo(src, idx),
          "className on intrinsic: consumer CSS is forbidden (§3)",
          "className",
          `use a kit component instead of <${tag}>`,
        );
      else if (name === "style")
        add(
          warn,
          f,
          lineNo(src, idx),
          intrinsic
            ? "heuristic slot: intrinsic with inline style in a kelir-importing file"
            : "inline style on a non-intrinsic element (§3: the kit closes all visuals)",
          intrinsic ? "heuristic-slot" : "style",
          intrinsic
            ? `move this visual into a kit component (e.g. ${TAG_KIT[tag] ?? "Stack/Card"})`
            : "move this visual into a kit component prop",
        );
    }
    if (intrinsic && RAW_TAGS.has(tag) && !exempt)
      add(
        err,
        f,
        lineNo(src, index),
        `raw intrinsic <${tag}> tag: use a kit component (§3/F9)`,
        "raw-tag",
        `replace <${tag}> with ${TAG_KIT[tag] ?? "a kit component"}`,
      );
  }
  // F9: consumer <style> block = ERROR, unless its body is kit-owned CSS
  // (identifiers imported from kelir, e.g. hideBeforeReadyCss).
  for (const st of blank.matchAll(/<style\b/g)) {
    const gte = blank.indexOf(">", st.index);
    if (gte === -1) continue;
    const close = blank.indexOf("</style", gte + 1);
    const body = src.slice(gte + 1, close === -1 ? undefined : close);
    const kitOwned = [...kelirImports].some((n) =>
      new RegExp(`\\b${n.replace(/\$/g, "\\$")}\\b`).test(body),
    );
    if (!kitOwned)
      add(
        err,
        f,
        lineNo(src, st.index),
        "consumer <style> block: consumer CSS is forbidden (§3) - move to a kit prop",
        "consumer-style",
        "move these rules into a kit prop (e.g. Stack gap, Card title) or the theme",
      );
  }
  const dataAttrs = [...src.matchAll(/data-[a-z-]+\s*=/g)].map((m) => m[0].split("=")[0].trim());
  const foreignData = dataAttrs.filter((a) => !a.startsWith("data-kelir-"));
  if (foreignData.length > 0 && /(style|StyleSheet|css)/.test(src))
    add(
      warn,
      f,
      1,
      "data-* + styling detected (manual check: for styling?)",
      "data-attr",
      "use data-testid for tests; styling belongs to the kit",
    );

  // Issue #116: rewrite the deterministic raw-tag -> kit component mappings.
  // Fixed occurrences stop being ERRORs; anything unsafe stays an ERROR and is
  // listed as SKIPPED so the consumer knows why.
  if (FIX && !exempt) {
    const { applied, skipped, next } = applyFixes(src, blank, tags);
    for (const change of applied) {
      fixes.push({ file: f, tag: change.tag, component: change.component, count: change.count, line: change.line });
      for (let i = err.length - 1; i >= 0; i--) {
        const entry = err[i];
        if (entry.file === f && entry.rule === "raw-tag" && entry.msg.includes(`<${change.tag}>`))
          err.splice(i, 1);
      }
    }
    for (const skip of skipped)
      skips.push({ file: f, tag: skip.tag, reason: skip.reason, count: skip.count });
    if (applied.length > 0) {
      if (DRY_RUN) planned.add(f);
      else {
        writeFileSync(f, next);
        rewritten.add(f);
      }
    }
  }
}

// 3. Global .Mui* / .kelir-* override outside kelir
for (const f of walk(SRC)) {
  if (inKelir(f)) continue;
  if (!/\.(css|tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  const lines = src.split("\n");
  lines.forEach((ln, i) => {
    if (/\.Mui[A-Z][\w-]*\s*[{.,:#[]/.test(ln))
      add(
        err,
        f,
        i + 1,
        "global .Mui* override outside kelir (forbidden §3b)",
        "mui-override",
        "use the kit component instead of a global .Mui* override",
      );
    if (/\.kelir-[\w-]*\s*[{.,:#[]/.test(ln))
      add(
        warn,
        f,
        i + 1,
        "selector .kelir-* outside the kit (make sure it is not kit-internal §3b)",
        "kelir-selector",
        "target the kit component, not its internal .kelir-* class",
      );
  });
}

// 4. Hardcode in kelir-components (file allowlist + kelir-allow lines)
for (const f of walk(KELIR_COMP)) {
  const src = readFileSync(f, "utf8");
  const lines = src.split("\n");
  lines.forEach((ln, i) => {
    if (/(?<![&\w])#[0-9a-fA-F]{3,8}\b/.test(ln) && !/^\s*(\/\/|\*)/.test(ln))
      add(
        err,
        f,
        i + 1,
        "hardcoded hex (use css.* or move to the allowlist)",
        "hex",
        "use a css.* token (colors / border / shadows)",
      );
    if (/rgba?\s*\(/.test(ln))
      add(
        err,
        f,
        i + 1,
        "hardcoded rgba()/rgb() (use css.*)",
        "rgba",
        "use a css.* color token",
      );
    if (/box-shadow\s*:/.test(ln))
      add(
        err,
        f,
        i + 1,
        "raw box-shadow (use css.*)",
        "box-shadow",
        "use css.shadows.card / convex / concave",
      );
    if (/font-family\s*:/.test(ln))
      add(
        err,
        f,
        i + 1,
        "raw font-family (use css.*)",
        "font-family",
        "use the active theme font (css.typography / fontFamily)",
      );
  });
}

// 5. Interim wrapper: Stack/Grid/Spacer/Container/FlexItem/Shell already
// exist → layout-token wrappers must migrate (warn→error per §8-P1b,
// deadline 2026-11-10).
for (const f of walk(SRC)) {
  if (inKelir(f) || !/\.(tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  if (/css\.layout|var\(--space-|var\(--layout-/.test(src))
    add(
      err,
      f,
      1,
      "interim layout: use Stack/Grid/Spacer/Container/FlexItem/Shell, not token wrappers (§8-P1b)",
      "layout-interim",
      "use Stack / Grid / Spacer / Container / FlexItem / Shell",
    );
}

// A specific --explain <rule> reports the affected files, so it runs after the
// scan and replaces the report.
if (explain !== null) printExplain(explain);

printReport({
  gate: "kelir-guard",
  version: TOOLS_VERSION,
  status: err.length > 0 ? "FAIL" : "OK",
  counts: {
    error: err.length,
    warn: warn.length,
    allow: allowed.length + suppressed.length,
    fixed: fixes.length,
  },
  rows: [
    ...allowed.map((a) => ({
      level: "ALLOW",
      location: `${rel(a.file)}:${a.line}`,
      rule: a.rule,
      message: a.msg,
      suggestion: a.reason,
    })),
    ...suppressed.map((s) => ({
      level: "ALLOW",
      location: `${rel(s.file)}:${s.line}`,
      rule: s.rule,
      message: s.msg,
      suggestion: `${CONFIG_REASON} suppressed (config)`,
    })),
    ...warn.map((w) => ({
      level: "WARN",
      location: `${rel(w.file)}:${w.line}`,
      rule: w.rule,
      message: w.msg,
      suggestion: w.suggestion,
    })),
    ...err.map((e) => ({
      level: "ERROR",
      location: `${rel(e.file)}:${e.line}`,
      rule: e.rule,
      message: e.msg,
      suggestion: e.suggestion,
    })),
  ],
  emptyText: "(no guard violations)",
  scope: {
    "consumer files scanned": scope.scanned,
    "kit-internal excluded": scope.kitInternal,
    "without kelir import": scope.noImport,
    "warn suppressed (.kelirrc)": suppressed.length,
    ...(fixes.length > 0
      ? { [DRY_RUN ? "files planned" : "files rewritten"]: DRY_RUN ? planned.size : rewritten.size }
      : {}),
  },
});

if (fixes.length > 0) {
  console.log("");
  console.log(BOLD + (DRY_RUN ? "Planned fixes" : "Fixed") + RESET);
  printTable(
    [
      { key: "location", label: "LOCATION" },
      { key: "change", label: "CHANGE" },
      { key: "count", label: "TAGS" },
    ],
    fixes.map((fix) => ({
      location: `${rel(fix.file)}:${fix.line}`,
      change: `<${fix.tag}> -> <${fix.component}>`,
      count: fix.count,
    })),
  );
}

if (skips.length > 0) {
  console.log("");
  console.log(BOLD + "Skipped (manual review)" + RESET);
  printTable(
    [
      { key: "location", label: "LOCATION" },
      { key: "tag", label: "TAG" },
      { key: "reason", label: "REASON" },
    ],
    skips.map((skip) => ({
      location: rel(skip.file),
      tag: `<${skip.tag}> x${skip.count}`,
      reason: skip.reason,
    })),
  );
}

if (STRICT && err.length > 0) process.exit(1);
