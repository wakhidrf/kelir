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
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// scripts/ -> kelir/ -> views/ -> src/ -> <project>
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SRC = join(ROOT, "src");
const KELIR = join(SRC, "views", "kelir");
const KELIR_COMP = join(KELIR, "kelir-components");
const STRICT = process.argv.includes("--strict");

const ALLOW_FILES = new Set(["kelir-styles.ts", "kelir-variants.ts"]);
const BANNED_PROPS = ["style", "sx", "className", "slotProps", "classes", "components", "componentsProps", "slot"];

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
const add = (list, file, line, msg) => list.push(`${rel(file)}:${line}: ${msg}`);

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
        add(warn, f, lineNo(src, idx), `banned prop '${name}' on component (needs review: Kelir?)`);
      else if (intrinsic && name === "className")
        add(err, f, lineNo(src, idx), "className on intrinsic: consumer CSS is forbidden (§3)");
      else if (name === "style")
        add(
          warn,
          f,
          lineNo(src, idx),
          intrinsic
            ? "heuristic slot: intrinsic with inline style in a kelir-importing file"
            : "inline style on a non-intrinsic element (§3: the kit closes all visuals)",
        );
    }
    if (intrinsic && RAW_TAGS.has(tag) && !exempt)
      add(err, f, lineNo(src, index), `raw intrinsic <${tag}> tag: use a kit component (§3/F9)`);
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
      add(err, f, lineNo(src, st.index), "consumer <style> block: consumer CSS is forbidden (§3) - move to a kit prop");
  }
  const dataAttrs = [...src.matchAll(/data-[a-z-]+\s*=/g)].map((m) => m[0].split("=")[0].trim());
  const foreignData = dataAttrs.filter((a) => !a.startsWith("data-kelir-"));
  if (foreignData.length > 0 && /(style|StyleSheet|css)/.test(src))
    add(warn, f, 1, "data-* + styling detected (manual check: for styling?)");
}

// 3. Global .Mui* / .kelir-* override outside kelir
for (const f of walk(SRC)) {
  if (inKelir(f)) continue;
  if (!/\.(css|tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  const lines = src.split("\n");
  lines.forEach((ln, i) => {
    if (/\.Mui[A-Z][\w-]*\s*[{.,:#[]/.test(ln))
      add(err, f, i + 1, "global .Mui* override outside kelir (forbidden §3b)");
    if (/\.kelir-[\w-]*\s*[{.,:#[]/.test(ln))
      add(warn, f, i + 1, "selector .kelir-* outside the kit (make sure it is not kit-internal §3b)");
  });
}

// 4. Hardcode in kelir-components (file allowlist + kelir-allow lines)
for (const f of walk(KELIR_COMP)) {
  const src = readFileSync(f, "utf8");
  const lines = src.split("\n");
  lines.forEach((ln, i) => {
    if (/kelir-allow:/.test(ln)) return;
    if (/(?<![&\w])#[0-9a-fA-F]{3,8}\b/.test(ln) && !/^\s*(\/\/|\*)/.test(ln))
      add(err, f, i + 1, "hardcoded hex (use css.* or move to the allowlist)");
    if (/rgba?\s*\(/.test(ln))
      add(err, f, i + 1, "hardcoded rgba()/rgb() (use css.*)");
    if (/(box-shadow|font-family)\s*:/.test(ln))
      add(err, f, i + 1, "raw box-shadow/font-family (use css.*)");
  });
}

// 5. Interim wrapper: Stack/Grid/Spacer/Container/FlexItem/Shell already
// exist → layout-token wrappers must migrate (warn→error per §8-P1b,
// deadline 2026-11-10).
for (const f of walk(SRC)) {
  if (inKelir(f) || !/\.(tsx|jsx)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  if (/css\.layout|var\(--space-|var\(--layout-/.test(src))
    add(err, f, 1, "interim layout: use Stack/Grid/Spacer/Container/FlexItem/Shell, not token wrappers (§8-P1b)");
}

console.log(`kelir-guard: ${err.length} ERROR, ${warn.length} WARN`);
for (const w of warn) console.log(`WARN  ${w}`);
for (const e of err) console.log(`ERROR ${e}`);
console.log(`scope: ${scope.scanned} consumer files scanned (JSX syntax); officially excluded: ${scope.kitInternal} kit-internal, ${scope.noImport} without kelir import, token allowlist: ${[...ALLOW_FILES].join(", ")}`);
if (STRICT && err.length > 0) process.exit(1);
