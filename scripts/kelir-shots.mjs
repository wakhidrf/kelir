// kelir-shots.mjs - P1d STYLE.md: screenshot regression per tema TANPA dep baru.
// Memakai Chrome/Edge sistem via CDP (WebSocket global Node 22+) + server
// `next start` lokal. Mode: tulis baseline (default) vs --check (bandingkan
// byte, exit 1 bila beda = CI merah). Determinisme: animasi/transisi dimatikan
// via CSS injeksi, tunggu document.fonts.ready, viewport tetap, Chrome sama.
// Baseline di-commit (referensi regresi); Chrome update => re-baseline sadar.
//
// Prasyarat: `npm run build` dulu (butuh .next/), Chrome/Edge terinstal.
//   npm run kelir:shots          # tulis ulang baseline
//   npm run kelir:shots:check    # bandingkan (Work in progress lokal)
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SHOT_DIR = join(ROOT, "src", "views", "kelir", "__shots__");
const CHECK = process.argv.includes("--check");
const PORT = 3100;
const BASE = `http://127.0.0.1:${PORT}/`;

// Cerminan union Theme di kelir-types.ts (sumber tunggal tetap di sana).
const THEMES = [
  "aurora-ui",
  "claymorphism",
  "dimensional-layering",
  "editorial-contemporaneo",
  "edtech-plataforma",
  "futuristic-glassmorphism",
  "glassmorphism",
  "liquid-glass",
  "neumorphism",
  "skeuomorphism",
  "spatial-ui",
];

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];

const FREEZE_CSS =
  "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

// Klien CDP minimal di atas WebSocket global (tanpa dep).
function cdp(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(String(ev.data));
    if (msg.id !== undefined && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  async function send(method, params = {}, sessionId) {
    await ready;
    const cur = ++id;
    const payload = { id: cur, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      pending.set(cur, { resolve, reject });
      ws.send(JSON.stringify(payload));
    });
  }
  return { send, close: () => ws.close() };
}

async function waitServer(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* belum siap */ }
    await sleep(1000);
  }
  throw new Error(`server tak siap: ${url}`);
}

async function main() {
  if (!existsSync(join(ROOT, ".next", "BUILD_ID"))) {
    console.error("kelir-shots: .next/ tak ada - jalankan `npm run build` dulu.");
    process.exit(1);
  }
  const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!chrome) {
    console.error("kelir-shots: Chrome/Edge tak ditemukan.");
    process.exit(1);
  }
  mkdirSync(SHOT_DIR, { recursive: true });

  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: ROOT,
    stdio: "ignore",
    shell: true,
  });
  const killAll = () => {
    try { server.kill(); } catch { /* abaikan */ }
  };
  process.on("exit", killAll);
  process.on("SIGINT", () => { killAll(); process.exit(1); });

  try {
    await waitServer(BASE);
    const dbg = spawn(chrome, [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--window-size=1280,900",
      "--remote-debugging-port=9333",
      "about:blank",
    ], { stdio: "ignore" }); // tanpa shell: path absolut, argumen tak digabung

    // Tunggu endpoint CDP Chrome siap (spawn tak sinkron).
    let version = null;
    for (let i = 0; i < 30 && !version; i++) {
      try {
        version = await get("http://127.0.0.1:9333/json/version");
      } catch {
        await sleep(1000);
      }
    }
    if (!version) throw new Error("endpoint CDP Chrome tak siap di :9333");
    const browser = cdp(version.webSocketDebuggerUrl);
    const diffs = [];

    for (const theme of THEMES) {
      const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" });
      const { sessionId } = await browser.send("Target.attachToTarget", { targetId, flatten: true });
      const send = (m, p = {}) => browser.send(m, p, sessionId);
      await send("Page.enable");
      await send("Emulation.setDeviceMetricsOverride", {
        width: 1280, height: 900, deviceScaleFactor: 1, mobile: false,
      });
      await send("Page.navigate", { url: BASE });
      // Tunggu DOM siap via polling (tanpa API khayalan).
      for (let i = 0; i < 30; i++) {
        const st = await send("Runtime.evaluate", {
          expression: "document.readyState",
        });
        if (st?.result?.value === "complete") break;
        await sleep(1000);
      }
      // Cookie via konteks halaman, lalu reload agar SSR baca cookie.
      await send("Runtime.evaluate", {
        expression: `document.cookie="kelir_lang=en;path=/";document.cookie="kelir_theme=${theme};path=/";"ok"`,
        awaitPromise: false,
      });
      await send("Page.navigate", { url: BASE });
      // Tunggu hidrasi + font, bekukan animasi, buka tab Galeri/Showcase.
      await send("Runtime.evaluate", {
        expression: `(async()=>{await document.fonts.ready;return document.readyState;})()`,
        awaitPromise: true,
      });
      await sleep(1500);
      await send("Runtime.evaluate", {
        expression: `(()=>{const s=document.createElement("style");s.textContent=${JSON.stringify(FREEZE_CSS)};document.head.appendChild(s);window.scrollTo(0,0);const b=[...document.querySelectorAll("button")].find(x=>x.textContent.trim()==="Showcase");if(b)b.click();return b?"clicked":"NO_SHOWCASE_TAB";})()`,
      });
      await sleep(2500);
      const { data } = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
      });
      const buf = Buffer.from(data, "base64");
      const file = join(SHOT_DIR, `${theme}.png`);
      if (CHECK) {
        if (!existsSync(file)) {
          diffs.push(`${theme}: tanpa baseline`);
        } else if (!readFileSync(file).equals(buf)) {
          diffs.push(`${theme}: BERBEDA dari baseline`);
          writeFileSync(join(SHOT_DIR, `${theme}.actual.png`), buf);
        }
      } else {
        writeFileSync(file, buf);
      }
      await browser.send("Target.closeTarget", { targetId });
      console.log(`kelir-shots: ${theme} OK (${(buf.length / 1024).toFixed(0)} KB)`);
    }

    browser.close();
    dbg.kill();
    if (CHECK && diffs.length > 0) {
      console.error("kelir-shots: MISMATCH");
      for (const d of diffs) console.error(`  - ${d}`);
      console.error("Lihat *.actual.png; bila perubahan disengaja, jalankan `npm run kelir:shots` lalu commit baseline.");
      process.exit(1);
    }
    console.log(CHECK ? "kelir-shots: OK - 11 tema sama dengan baseline." : "kelir-shots: baseline ditulis - 11 tema.");
  } finally {
    killAll();
  }
}

main().catch((e) => {
  console.error(`kelir-shots: GAGAL - ${e.message}`);
  process.exit(1);
});
