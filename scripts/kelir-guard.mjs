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
// rule summary + docs link (run it with no rule to list every rule).
// Version: see kelir-version.mjs (bump the minor on rule changes that add
// errors, so consumers can pin a known-good kit tag).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { TOOLS_VERSION } from "./kelir-version.mjs";
import { printReport, printTable } from "./kelir-report.mjs";

// scripts/ -> kelir/ -> views/ -> src/ -> <project>
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KELIR = join(SRC, "views", "kelir");
const KELIR_COMP = join(KELIR, "kelir-components");
const STRICT = process.argv.includes("--strict");

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

function explainTarget() {
  const i = process.argv.indexOf("--explain");
  if (i !== -1) return process.argv[i + 1] ?? "";
  const eq = process.argv.find((a) => a.startsWith("--explain="));
  return eq ? eq.slice("--explain=".length) : null;
}

const explain = explainTarget();
if (explain !== null) {
  console.log(`kelir-guard v${TOOLS_VERSION}`);
  console.log("");
  if (explain === "") {
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
    process.exit(0);
  }
  if (!RULES[explain]) {
    console.error(`kelir-guard: unknown rule '${explain}'.`);
    console.error(`Available rules: ${Object.keys(RULES).join(", ")}`);
    process.exit(2);
  }
  printTable(
    [
      { key: "field", label: "FIELD" },
      { key: "value", label: "VALUE" },
    ],
    [
      { field: "rule", value: explain },
      { field: "summary", value: RULES[explain].summary },
      { field: "docs", value: RULES[explain].docs },
    ],
  );
  process.exit(0);
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
const scope = { scanned: 0, kitInternal: 0, noImport: 0 };
const allowed = [];
const sourceCache = new Map();

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
const add = (list, file, line, msg, rule, suggestion) => {
  const reason = allowReason(file, line);
  if (reason) {
    allowed.push({ file, line, msg, rule, suggestion, reason });
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
    hits.push({ tag, attrs, index: m.index });
  }
  return hits;
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
  for (const { tag, attrs, index } of scanJsxTags(blank)) {
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
          "style",
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

printReport({
  gate: "kelir-guard",
  version: TOOLS_VERSION,
  status: err.length > 0 ? "FAIL" : "OK",
  counts: { error: err.length, warn: warn.length, allow: allowed.length },
  rows: [
    ...allowed.map((a) => ({
      level: "ALLOW",
      location: `${rel(a.file)}:${a.line}`,
      rule: a.rule,
      message: a.msg,
      suggestion: a.reason,
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
  },
});
if (STRICT && err.length > 0) process.exit(1);
