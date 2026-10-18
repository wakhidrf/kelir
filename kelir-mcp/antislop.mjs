// antislop.mjs - the anti-slop filter for the Kelir MCP (F3).
//
// Loads the vendored mirror (antislop/index.json + SKILL.md) and exposes:
//   filterText(anti)      - the always-loaded core filter (kelir://antislop)
//   skillText(anti, name) - one sub-skill (kelir://antislop/{skill})
//   audit(anti, input)    - deterministic slop matchers over text/jsx
//
// Zero network, zero LLM: every match comes from a hand-written regex whose id
// must exist in index.json (fail-closed), so a rule rename upstream is caught
// instead of silently weakening the filter.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const SUB_SKILLS = [
  "antislop-ui",
  "antislop-copywriting",
  "antislop-human",
  "antislop-layoutmobile",
  "antislop-code",
];

// scope: "text" = prose/copy (user-facing strings), "code" = jsx/css/comments,
// "both". Exported so the repo gate (scripts/kelir-slop.mjs) uses the exact same
// regexes instead of duplicating them.
export const MATCHERS = [
  // core rules
  { rule: "R-02", scope: "text", why: "em dash in written text; use a comma, period, colon, or parentheses", re: /[\u2014\u2013]/ },
  { rule: "R-16", scope: "text", why: "buzzword; say what the thing does instead", re: /\b(?:unlock|elevate|empower|delve|seamless|game[\s-]?changer|cutting[\s-]edge|revolutionary|next[\s-]gen|unleash|effortless|supercharge|skyrocket|transformative|world[\s-]class|best[\s-]in[\s-]class|industry[\s-]leading|state[\s-]of[\s-]the[\s-]art|leverage|synergy|paradigm|robust)\b/i },
  { rule: "R-17", scope: "text", why: "invented number; only claim figures you can back", re: /\b\d+(?:\.\d+)?\s?(?:%|x\b|percent)\b|\b\d{2,}(?:[,.]\d{3})*\+?\s+(?:users|customers|downloads|teams|companies|stars)\b/i },
  { rule: "R-36", scope: "text", why: "unverifiable claim or social proof", re: /\btrusted by\b|\bstudies show\b|\bused by (?:thousands|millions)\b/i },
  // ui
  { rule: "antislop-ui--generic-blue-purple-gradient", scope: "code", why: "default blue-purple gradient; pick a purposeful palette", re: /linear-gradient\([^)]*?(?:#6366f1|#8b5cf6|#a855f7|#7c3aed|#4f46e5|indigo|blueviolet)/i },
  { rule: "antislop-ui--excessive-glassmorphism", scope: "code", why: "glassmorphism for no reason", re: /backdrop-filter\s*:\s*[^;]*blur/i },
  { rule: "antislop-ui--excessive-border-radius", scope: "code", why: "oversized corner radius", re: /border-radius\s*:\s*(?:[2-9]\d{1,}|9{3,})px|border-radius\s*:\s*(?:999|9999)px/i },
  { rule: "antislop-ui--emoji-as-decoration", scope: "both", why: "decorative emoji", re: /(?![\u2713\u2714])[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u },
  // copywriting
  { rule: "antislop-copywriting--empty-ai-vocabulary", scope: "text", why: "empty AI vocabulary", re: /\b(?:pave the way|dive into|in the realm of|a tapestry of|when it comes to|it'?s worth noting)\b/i },
  { rule: "antislop-copywriting--significance-inflation", scope: "text", why: "inflated significance", re: /\b(?:stands as a testament|plays a (?:vital|crucial|pivotal) role|underscores the importance|a beacon of)\b/i },
  { rule: "antislop-copywriting--fabricated-specifics", scope: "text", why: "specific-looking number without a source", re: /\b\d+(?:\.\d+)?% of (?:users|developers|teams)\b/i },
  { rule: "antislop-copywriting--all-caps-emphasis", scope: "text", why: "ALL-CAPS emphasis", re: /\b(?!(?:API|CSS|HTML|JSON|UI|UX|MCP|URL|HTTP|ID|CTA|FAQ|SVG|TODO|REST|CLI|DOM|SSR|SEO|OK|MIT|MVC|JSX|TSX|MUI|RTL|LTR|ARIA|WCAG|OTP|CPU|IDR|E2E|SQL|SDK|PNG|STYLE|README|CHANGELOG|LICENSE|CRLF)\b)(?![0-9A-F]{3,}\b)[A-Z]{3,}\b/ },
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

function buildRuleMap(index) {
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
  return map;
}

export function loadAntiSlop(dir) {
  const read = (p) => readFileSync(join(dir, "antislop", p), "utf8");
  const index = JSON.parse(read("index.json"));
  const rules = buildRuleMap(index);

  for (const m of MATCHERS) {
    if (!rules.has(m.rule)) {
      throw new Error(
        `antislop: matcher rule '${m.rule}' tak ada di index.json (aturan berubah?).`,
      );
    }
  }

  const core = read("skills/antislop/SKILL.md");
  const skills = {};
  for (const name of SUB_SKILLS) skills[name] = read(`skills/${name}/SKILL.md`);

  const header = [
    `# Kelir anti-slop filter (upstream v${index.version})`,
    "",
    `Mirror of ${index.source.repo} @ ${index.source.ref} (${index.source.commit.slice(0, 9)}), MIT.`,
    `${index.core.rules.length} core rules + ${index.skills.reduce((a, s) => a + s.patternCount, 0)} patterns. Load always.`,
    "",
    "---",
    "",
  ].join("\n");

  return { index, rules, core, skills, header };
}

export const filterText = (anti) => anti.header + anti.core;

export function skillText(anti, name) {
  const body = anti.skills[name];
  if (!body) return null;
  return `${anti.header}> Skill: ${name}\n\n---\n\n${body}`;
}

function notesFor(targets) {
  const notes = [];
  if (targets.has("ui")) notes.push("Kelir: pakai token warna/gerak dari kelir://tokens, jangan hex mentah; baca kelir://contract.");
  if (targets.has("copy")) notes.push("Kelir: tulis copy apa adanya - tanpa klaim angka tanpa bukti, tanpa em dash.");
  if (targets.has("a11y")) notes.push("Kelir: pertahankan indikator fokus/keyboard; jangan hapus outline.");
  if (targets.has("mobile")) notes.push("Kelir: patuhi breakpoint heroCollapse (768px) dari kelir://tokens; hindari 100vh dan px tetap.");
  if (targets.has("code")) notes.push("Kelir: komentar hanya yang menambah informasi; jangan menyunting kode.");
  return notes;
}

export function audit(anti, { text = "", jsx = "" } = {}) {
  const haystacks = { text, code: jsx };
  const matches = [];
  const seen = new Set();
  const targets = new Set();

  for (const m of MATCHERS) {
    const hay = m.scope === "both" ? `${text}\n${jsx}` : haystacks[m.scope];
    if (!hay) continue;
    const hit = m.re.exec(hay);
    if (!hit) continue;
    const meta = anti.rules.get(m.rule);
    if (seen.has(m.rule)) continue;
    seen.add(m.rule);
    targets.add(meta.target);
    matches.push({
      rule: m.rule,
      kind: meta.kind,
      title: meta.title,
      skill: meta.skill,
      target: meta.target,
      severity: meta.severity ?? null,
      why: m.why,
      excerpt: hit[0].slice(0, 60),
    });
  }

  return {
    matches,
    notes: matches.length ? notesFor(targets) : [],
    ...(matches.length
      ? { gate: "Run the Delivery Gate in kelir://antislop before delivering." }
      : { ok: true }),
  };
}
