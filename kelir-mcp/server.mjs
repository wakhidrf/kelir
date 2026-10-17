// server.mjs — MCP server resmi Kelir (stdio).
// SDK MCP resmi, ESM tanpa build step. Tanpa stdout selain protokol
// (log diagnostik ke stderr). Untuk test, import createKelirServer.
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export function createKelirServer(snap) {
  const server = new McpServer(
    { name: "kelir", version: "1.0.0" },
    { capabilities: { resources: {}, prompts: {} } },
  );

  server.resource(
    "kelir-components",
    "kelir://components",
    { mimeType: "application/json" },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({
          count: snap.components.length,
          components: snap.components,
        }),
      }],
    }),
  );

  server.resource(
    "kelir-tokens",
    "kelir://tokens",
    { mimeType: "application/json" },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({ tokens: snap.tokens }),
      }],
    }),
  );

  server.resource(
    "kelir-contract",
    "kelir://contract",
    { mimeType: "text/markdown" },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: snap.contract }],
    }),
  );

  server.prompt(
    "design-flow",
    "Design → pick a Kelir component → verify the sealed contract",
    async () => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: [
            "Follow the Kelir design flow:",
            "1. DESAIN: clarify the user's wish (layout, tone, viewport).",
            "2. PILIH: read kelir://components, pick ONE sealed component that fits — never assemble your own from primitives. MUI is only the kit's base: in consumer code use Kelir components (icons/hooks excepted).",
            "3. TOKEN: read kelir://tokens for spacing/motion/status values (no raw hex, no off-token sizes).",
            "4. VERIFIKASI: read kelir://contract and check the snippet passes every rule before presenting it.",
          ].join("\n"),
        },
      }],
    }),
  );

  return server;
}

function loadSnapshot() {
  const dir = dirname(fileURLToPath(import.meta.url));
  return JSON.parse(readFileSync(join(dir, "snapshot.json"), "utf8"));
}

const invokedAs = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedAs === fileURLToPath(import.meta.url)) {
  await createKelirServer(loadSnapshot()).connect(new StdioServerTransport());
}
