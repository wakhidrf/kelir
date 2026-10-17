// server.mjs — MCP server resmi Kelir (stdio).
// SDK MCP resmi, ESM tanpa build step. Tanpa stdout selain protokol
// (log diagnostik ke stderr). Untuk test, import createKelirServer.
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Sinonim: jembatani keinginan (sering Indonesia) → kata yang benar-benar
// muncul di deskripsi/props komponen (Inggris). Data-driven: setiap target
// hanya memindahkan pencarian ke teks snapshot, bukan menamai komponen.
const SYNONYMS = {
  tombol: ["button"],
  pencet: ["button"],
  menu: ["menu", "dropdown"],
  aksi: ["action", "button", "menu"],
  mobile: ["mobile", "responsive"],
  ponsel: ["mobile", "responsive"],
  tabel: ["table", "column", "row", "data"],
  daftar: ["list", "item"],
  form: ["form", "input", "field", "select", "checkbox", "switch"],
  isian: ["input", "field"],
  masukan: ["input", "field"],
  pilih: ["select", "choice", "option"],
  pilihan: ["select", "option", "radio"],
  unggah: ["upload", "attachment", "file"],
  berkas: ["file", "attachment"],
  notif: ["notification", "toast", "alert"],
  notifikasi: ["notification", "toast", "alert"],
  pesan: ["message", "toast", "alert", "bubble"],
  modal: ["dialog", "modal", "overlay"],
  dialog: ["dialog", "modal"],
  popup: ["dialog", "popover", "menu"],
  tab: ["tab", "segment"],
  langkah: ["step", "stepper", "progress"],
  progres: ["progress", "spinner", "loading"],
  memuat: ["loading", "spinner", "progress"],
  kartu: ["card", "panel"],
  panel: ["panel", "card", "accordion"],
  judul: ["heading", "title", "typography"],
  teks: ["text", "typography"],
  gambar: ["image", "media", "avatar"],
  foto: ["image", "avatar", "media"],
  profil: ["avatar", "profile"],
  grafik: ["chart", "graph"],
  bagan: ["chart", "graph"],
  kalender: ["calendar", "date"],
  tanggal: ["date", "calendar"],
  navigasi: ["navigation", "nav", "breadcrumb", "menu"],
  sidebar: ["sidebar", "drawer", "navigation"],
  bilah: ["bar", "toolbar", "topbar"],
  geser: ["slider", "carousel", "resizable"],
  peringatan: ["alert", "warning"],
  kesalahan: ["error", "alert"],
  status: ["status", "badge", "progress"],
  label: ["label", "badge", "tag"],
  chip: ["chip", "badge", "tag"],
  komentar: ["comment", "bubble", "chat"],
  obrolan: ["chat", "bubble"],
  pengguna: ["user", "avatar", "profile"],
  akun: ["account", "profile", "avatar"],
  pengaturan: ["settings", "switch", "select"],
  cari: ["search", "input"],
  pencarian: ["search", "input"],
  tata: ["layout", "grid", "stack"],
  letak: ["layout", "grid", "stack"],
  kolom: ["column", "grid", "layout"],
  baris: ["row", "layout", "breadcrumb"],
  tema: ["theme"],
  ikon: ["icon"],
};

function buildIndex(snap) {
  return snap.components.map((c) => ({
    name: c.name,
    description: c.description,
    props: c.props,
    nameLc: c.name.toLowerCase(),
    hay: `${c.name} ${c.description} ${c.props}`.toLowerCase(),
  }));
}

function wishTerms(wish) {
  const base = wish.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const out = new Set(base);
  for (const w of base) for (const syn of SYNONYMS[w] ?? []) out.add(syn);
  return [...out].filter((t) => t.length >= 3);
}

function suggestComponents(index, wish, limit) {
  const terms = wishTerms(wish);
  return index
    .map((c) => {
      let score = 0;
      for (const t of terms) {
        if (c.nameLc.includes(t)) score += 3;
        else if (c.hay.includes(t)) score += 1;
      }
      return { name: c.name, description: c.description, props: c.props, score };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function createKelirServer(snap) {
  const index = buildIndex(snap);
  const server = new McpServer(
    { name: "kelir", version: "1.1.0" },
    { capabilities: { resources: {}, prompts: {}, tools: {} } },
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

  // v1.1 (issue #49): saran komponen dari keinginan bahasa alami. Tanpa
  // merakit sendiri: keluaran selalu kandidat sealed dari katalog.
  server.tool(
    "suggest",
    "Suggest the sealed Kelir component(s) that best fit a plain-language UI wish. Prefer ONE component; never assemble your own from primitives. Read kelir://contract before using the snippet.",
    {
      wish: z
        .string()
        .min(1)
        .describe("Plain-language UI wish, e.g. 'rapi tombol aksi di mobile'"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(20)
        .optional()
        .describe("Max suggestions (default 5)"),
    },
    async ({ wish, limit }) => {
      const suggestions = suggestComponents(index, wish, limit ?? 5);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(
            {
              wish,
              suggestions,
              note: "Pick ONE sealed component, then read kelir://contract and verify the snippet (no style/sx/className, no raw hex, no off-token size). MUI is only the kit's base.",
            },
            null,
            2,
          ),
        }],
      };
    },
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
