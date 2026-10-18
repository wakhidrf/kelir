// build-antislop-index.mjs - deterministic rule index for the vendored
// anti-slop mirror (F2).
//
// Reads the mirrored SKILL.md files and emits antislop/index.json: a stable,
// source-ordered catalogue of every rule/pattern with an id, its gate/section,
// target surface, and a line reference into the mirrored file. No network, no
// timestamps, no LLM: the same mirror always yields byte-identical output.
//
// The upstream skill shape (verified against scripts/skill-index.mjs):
//   core (antislop): 38 rules `#### R-NN - Title` under `### Group N: ...`,
//     principles `### C-N - Title`, Delivery Gate `### Block N: ...`.
//   sub-skills: `## Section` -> `### Pattern Name` blocks that open with
//     `- **Tell:**` (or `- **The pattern:**`).
//
//   node kelir-mcp/tools/build-antislop-index.mjs          # write index.json
//   node kelir-mcp/tools/build-antislop-index.mjs --check  # fail if stale
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), ".."); // kelir-mcp/
const mirrorDir = join(root, "antislop");
const indexPath = join(mirrorDir, "index.json");

const CORE = "antislop";
const SUB_SKILLS = [
  "antislop-ui",
  "antislop-copywriting",
  "antislop-human",
  "antislop-layoutmobile",
  "antislop-code",
];

// Target surface per skill (the "what does this filter" axis).
const TARGETS = {
  antislop: "core",
  "antislop-ui": "ui",
  "antislop-copywriting": "copy",
  "antislop-human": "a11y",
  "antislop-layoutmobile": "mobile",
  "antislop-code": "code",
};

// Core rule gates -> (gate slug, severity). Groups come from the `### Group N:`
// headings in Part 2 of the core skill.
const GATES = {
  "Hard Gate": { gate: "hard", severity: "high" },
  "Purpose-Gate": { gate: "purpose", severity: "medium" },
  "Quality Locks": { gate: "quality", severity: "low" },
};

const die = (msg) => {
  console.error(`build-antislop-index: ${msg}`);
  process.exit(1);
};

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// One pass over a file, tracking fenced code so a `### ` inside an example is
// never mistaken for a heading. Returns headings with their 1-based line and a
// per-line fenced flag (to also skip entries inside fences).
function scan(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const fenced = new Array(lines.length).fill(false);
  let inFence = false;
  let fenceMark = "";
  const headings = [];
  lines.forEach((line, i) => {
    const m = line.match(/^\s*(```|~~~)/);
    if (m) {
      if (!inFence) {
        inFence = true;
        fenceMark = m[1];
      } else if (m[1] === fenceMark) {
        inFence = false;
      }
      fenced[i] = true;
      return;
    }
    fenced[i] = inFence;
    if (inFence) return;
    const h = line.match(/^(#{1,6})\s+(.*?)\s*$/);
    if (h) headings.push({ level: h[1].length, title: h[2], line: i + 1 });
  });
  return { lines, fenced, headings };
}

// Slice headings into spans: each heading owns the lines up to the next
// heading of the same or shallower level.
function spans(headings, total) {
  return headings.map((h, idx) => {
    let end = total;
    for (let j = idx + 1; j < headings.length; j++) {
      if (headings[j].level <= h.level) {
        end = headings[j].line - 1;
        break;
      }
    }
    return { ...h, end };
  });
}

const isEntry = (line) => /^\s*-\s*\*\*(?:Tell|The pattern):\*\*/.test(line);

function valueOfEntry(line) {
  const m = line.match(/^\s*-\s*\*\*(?:Tell|The pattern):\*\*\s*(.*)$/);
  return (m ? m[1] : "").replace(/\*\*/g, "").trim();
}

const ruleRefs = (text) =>
  [...new Set(text.match(/R-\d{2}/g) ?? [])].sort();

function parseCore(name) {
  const text = readFileSync(join(mirrorDir, "skills", name, "SKILL.md"), "utf8");
  const { lines, fenced, headings } = scan(text);
  const sp = spans(headings, lines.length);

  const rules = [];
  const craftsmanship = [];
  const deliveryGate = [];
  const warningSigns = [];
  let group = null;
  let gate = "unknown";
  let inPart1 = false;
  let inGate = false;

  for (const h of sp) {
    if (h.level === 2) {
      inPart1 = /^Part 1:/.test(h.title);
      inGate = /^Delivery Gate/.test(h.title);
      if (inGate) gate = "unknown";
      continue;
    }
    const gm = h.title.match(/^Group \d+:\s*([^(]+?)\s*(?:\(|$)/);
    if (h.level === 3 && gm) {
      group = gm[1].trim();
      gate = GATES[group]?.gate ?? "unknown";
      continue;
    }
    if (inPart1 && h.level === 3) {
      warningSigns.push({ id: `W-${slug(h.title)}`, title: h.title, line: h.line });
      continue;
    }
    if (inGate && h.level === 3) {
      deliveryGate.push({ id: `G-${deliveryGate.length + 1}`, title: h.title, line: h.line });
      continue;
    }
    const cm = h.title.match(/^(C-\d)\s*[-\u2014\u2013]\s*(.+)$/);
    if (h.level === 3 && cm) {
      craftsmanship.push({ id: cm[1], title: cm[2].trim(), line: h.line });
      continue;
    }
    const rm = h.title.match(/^(R-\d{2})\s*[-\u2014\u2013]\s*(.+)$/);
    if (h.level === 4 && rm) {
      const body = lines
        .slice(h.line, h.end)
        .filter((_, k) => !fenced[h.line + k])
        .join("\n");
      const req = (body.match(/\*\*(FORBIDDEN|REQUIRED)\*\*/) ?? [])[1] ?? null;
      const { gate: g, severity } = GATES[group] ?? { gate: "unknown", severity: "medium" };
      rules.push({
        id: rm[1],
        title: rm[2].trim(),
        gate: g,
        severity,
        requirement: req,
        refs: ruleRefs(body),
        line: h.line,
      });
      continue;
    }
  }

  return { rules, craftsmanship, deliveryGate, warningSigns };
}

function parseSubSkill(name) {
  const text = readFileSync(join(mirrorDir, "skills", name, "SKILL.md"), "utf8");
  const { lines, fenced, headings } = scan(text);
  const sp = spans(headings, lines.length);

  const sections = [];
  let section = null;
  for (const h of sp) {
    if (h.level === 2) {
      if (/^(How to use|What NOT to flag|Signs of human|Voice calibration)/.test(h.title)) {
        section = null;
        continue;
      }
      if (/Checklist$/.test(h.title)) {
        section = null;
        continue;
      }
      section = { title: h.title, line: h.line, patterns: [] };
      sections.push(section);
      continue;
    }
    if (h.level !== 3 || !section) continue;
    const body = [];
    for (let k = h.line; k < h.end; k++) {
      if (!fenced[k]) body.push(lines[k]);
    }
    const entry = body.find(isEntry);
    if (!entry) continue;
    section.patterns.push({
      id: `${slug(name)}--${slug(h.title)}`,
      name: h.title,
      tell: valueOfEntry(entry),
      refs: ruleRefs(body.join("\n")),
      line: h.line,
    });
  }

  return {
    name,
    target: TARGETS[name],
    sections: sections.filter((s) => s.patterns.length > 0),
  };
}

function build() {
  const lock = JSON.parse(readFileSync(join(mirrorDir, "upstream.lock.json"), "utf8"));
  const version = readFileSync(join(mirrorDir, "skills", "antislop", "VERSION"), "utf8").trim();

  const present = readdirSync(join(mirrorDir, "skills"), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  const missing = [CORE, ...SUB_SKILLS].filter((n) => !present.includes(n));
  if (missing.length) die(`skill mirror tidak lengkap: ${missing.join(", ")} hilang.`);
  if (present.length !== 1 + SUB_SKILLS.length) {
    die(`jumlah skill tak terduga: ${present.length} (harap telaah sebelum mempercayai indeks).`);
  }

  const core = parseCore(CORE);
  if (core.rules.length !== 38) {
    die(`inti punya ${core.rules.length} aturan, harusnya 38 (bentuk SKILL.md berubah).`);
  }
  const ids = core.rules.map((r) => r.id).sort();
  const expect = Array.from({ length: 38 }, (_, i) => `R-${String(i + 1).padStart(2, "0")}`);
  if (ids.join(",") !== expect.join(",")) {
    die("id aturan inti tidak lagi R-01..R-38 tanpa celah/pengulangan.");
  }

  const skills = SUB_SKILLS.map(parseSubSkill);
  for (const s of skills) {
    const n = s.sections.reduce((a, x) => a + x.patterns.length, 0);
    if (n === 0) die(`skill ${s.name} tak punya pola ber-format '- **Tell:**'.`);
  }

  return {
    version,
    source: { repo: lock.repo, ref: lock.ref, commit: lock.commit },
    core: {
      skill: CORE,
      file: "skills/antislop/SKILL.md",
      rules: core.rules,
      craftsmanship: core.craftsmanship,
      deliveryGate: core.deliveryGate,
      warningSigns: core.warningSigns,
    },
    skills: skills.map((s) => ({
      name: s.name,
      file: `skills/${s.name}/SKILL.md`,
      target: s.target,
      patternCount: s.sections.reduce((a, x) => a + x.patterns.length, 0),
      sections: s.sections.map((x) => ({
        title: x.title,
        line: x.line,
        patterns: x.patterns,
      })),
    })),
  };
}

const json = `${JSON.stringify(build(), null, 2)}\n`;
const args = process.argv.slice(2);

if (args.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(indexPath, "utf8");
  } catch {
    die("index.json belum ada; jalankan tanpa --check untuk membuatnya.");
  }
  if (current !== json) {
    die("index.json basi/berbeda dari sumber; jalankan `node kelir-mcp/tools/build-antislop-index.mjs`.");
  }
  const n = JSON.parse(current);
  const patterns = n.skills.reduce((a, s) => a + s.patternCount, 0);
  console.log(`build-antislop-index: OK - v${n.version}, ${n.core.rules.length} aturan inti + ${patterns} pola (cocok).`);
} else if (args.length === 0) {
  writeFileSync(indexPath, json);
  const patterns = build().skills.reduce((a, s) => a + s.patternCount, 0);
  console.log(`build-antislop-index: OK - tulis antislop/index.json (38 aturan inti + ${patterns} pola).`);
} else {
  die(`argumen tak dikenal: ${args.join(" ")} (pakai --check atau tanpa argumen).`);
}
