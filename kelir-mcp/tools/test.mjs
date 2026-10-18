// test.mjs — conformance MCP end-to-end (stdio asli) + determinism snapshot.
// Client SDK resmi spawn `node server.mjs`; tanpa framework, fail-closed.
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const MCP_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KIT_ROOT = join(MCP_ROOT, "..");
const committed = readFileSync(join(MCP_ROOT, "snapshot.json"), "utf8");

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [join(MCP_ROOT, "server.mjs")],
  stderr: "ignore",
});
const client = new Client({ name: "kelir-test", version: "0" }, { capabilities: {} });
await client.connect(transport);

// 1. Resources ter-list: 3 inti + anti-slop inti + 5 sub-skill.
const { resources } = await client.listResources();
const uris = resources.map((r) => r.uri).sort();
for (const u of ["kelir://components", "kelir://contract", "kelir://tokens", "kelir://antislop"]) {
  assert.ok(uris.includes(u), `resource ${u} tak ter-list`);
}
for (const s of [
  "antislop-ui",
  "antislop-copywriting",
  "antislop-human",
  "antislop-layoutmobile",
  "antislop-code",
]) {
  assert.ok(uris.includes(`kelir://antislop/${s}`), `sub-skill ${s} tak ter-list`);
}

// 2. components: valid JSON, 78 entri, tiap entri bernama + berprops.
const compText = (await client.readResource({ uri: "kelir://components" })).contents[0].text;
const comp = JSON.parse(compText);
assert.equal(comp.count, comp.components.length);
assert.ok(comp.count > 0, "katalog kosong");
for (const c of comp.components) {
  assert.ok(c.name, "komponen tanpa nama");
  assert.ok(c.props, `${c.name} tanpa props`);
}
assert.ok(comp.components.some((c) => c.name === "DropdownMenu" && c.props.includes("triggerVariant")));
assert.ok(comp.components.some((c) => c.name === "TopBar" && c.props.includes("variant")));

// 3. tokens: tema + skala + motion + status terisi.
const tokens = JSON.parse((await client.readResource({ uri: "kelir://tokens" })).contents[0].text).tokens;
assert.ok(tokens.themes.includes("neumorphism"));
assert.equal(tokens.space.sm, "0.5rem");
assert.equal(tokens.breakpoints.heroCollapse, "768px");
assert.ok(tokens.motion.ease.base && tokens.motion.spring.base && tokens.motion.liquidGlass.base);
assert.ok(tokens.statusColors.success.bg.startsWith("#"));

// 4. contract: teks + menyebut aturan inti.
const contract = (await client.readResource({ uri: "kelir://contract" })).contents[0].text;
assert.ok(contract.includes("sealed contract") && contract.includes("style/sx/className"));
// MUI = basis kit (bukan larangan); komponen UI konsumen wajib dari Kelir.
assert.ok(contract.includes("MUI is Kelir's base") && contract.includes("@mui/icons-material"));

// 5. Prompt design-flow: ter-list + menyebut ketiga resources.
const { prompts } = await client.listPrompts();
assert.ok(prompts.some((p) => p.name === "design-flow"));
const flow = await client.getPrompt({ name: "design-flow" });
const flowText = flow.messages.map((m) => m.content.text ?? "").join("\n");
assert.ok(flowText.includes("kelir://components") && flowText.includes("kelir://contract"));

// 5b. Tool suggest (v1.1, issue #49): keinginan bahasa alami → kandidat sealed.
const { tools } = await client.listTools();
assert.ok(tools.some((t) => t.name === "suggest"), "tool suggest tak ter-list");
const sug = await client.callTool({
  name: "suggest",
  arguments: { wish: "rapi tombol aksi di mobile" },
});
const sugJson = JSON.parse(sug.content[0].text);
assert.ok(Array.isArray(sugJson.suggestions) && sugJson.suggestions.length > 0,
  "suggest tak mengembalikan kandidat");
for (const s of sugJson.suggestions) {
  assert.ok(s.name && s.props, `saran tanpa nama/props: ${JSON.stringify(s)}`);
}
assert.ok(sugJson.suggestions.some((s) => s.name === "DropdownMenu"),
  "suggest 'tombol aksi di mobile' tak menyarankan DropdownMenu");

// 5c. Anti-slop (v1.2, F3): resource inti + audit deterministik.
const asText = (await client.readResource({ uri: "kelir://antislop" })).contents[0].text;
assert.ok(asText.includes("anti-slop filter") && asText.includes("upstream v"), "header anti-slop hilang");
const asIndex = JSON.parse(readFileSync(join(MCP_ROOT, "antislop", "index.json"), "utf8"));
assert.ok(asText.includes(asIndex.version), "versi upstream tak disebut di kelir://antislop");
const uiSkill = (await client.readResource({ uri: "kelir://antislop/antislop-ui" })).contents[0].text;
assert.ok(uiSkill.includes("Skill: antislop-ui"), "sub-skill ui tak berisi header");

const audited = await client.callTool({
  name: "audit",
  arguments: { text: "Our BEST-IN-CLASS platform unlocks 10x growth — trusted by 5000 teams", jsx: "style={{ outline: 'none' }}" },
});
const auditJson = JSON.parse(audited.content[0].text);
assert.ok(Array.isArray(auditJson.matches) && auditJson.matches.length > 0, "audit tak menemukan slop");
assert.ok(auditJson.matches.some((m) => m.rule === "R-02"), "audit tak menandai em dash (R-02)");
assert.ok(auditJson.matches.some((m) => m.rule === "antislop-human--removed-focus-outline"),
  "audit tak menandai outline:none");
const clean = await client.callTool({ name: "audit", arguments: { text: "A short, plain sentence." } });
assert.equal(JSON.parse(clean.content[0].text).matches.length, 0, "teks bersih malah kena aturan");

// 6. Determinism: regenerasi ke tmp wajib byte-identik dengan file ter-commit.
const tmp = mkdtempSync(join(tmpdir(), "kelir-snap-"));
execSync(`node ${join(MCP_ROOT, "tools", "snapshot.mjs")} --out ${join(tmp, "snapshot.json")}`, { cwd: KIT_ROOT });
assert.equal(readFileSync(join(tmp, "snapshot.json"), "utf8"), committed,
  "snapshot basi — jalankan node kelir-mcp/tools/snapshot.mjs lalu commit hasilnya");

await client.close();
console.log(`kelir-mcp test: OK — ${comp.count} komponen, resources + anti-slop v${asIndex.version}, 1 prompt, tools suggest+audit, snapshot deterministik.`);
