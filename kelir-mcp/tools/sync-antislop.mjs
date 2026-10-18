// sync-antislop.mjs - vendored mirror of the anti-slop rulebook (F1).
//
// The Kelir MCP applies the upstream "Anti Slop: Rules for AI Coding Agents"
// rulebook (MIT, miqdadbadjuber/anti-slop). It is VENDORED here as a pinned
// mirror so the MCP runs offline and byte-deterministically. This tool is the
// only writer of the mirrored content: never edit antislop/** by hand.
//
//   node kelir-mcp/tools/sync-antislop.mjs          # refresh the mirror (network)
//   node kelir-mcp/tools/sync-antislop.mjs --check  # verify local vs lock (offline, CI)
//
// Pin: edit PIN (a release tag, never a branch), then re-run the sync. The
// lock records the resolved commit plus a sha256 per mirrored file, so any
// local drift or upstream change is caught. Dep-free: global fetch + node:crypto.
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), ".."); // kelir-mcp/
const mirrorDir = join(root, "antislop");
const lockPath = join(mirrorDir, "upstream.lock.json");

// Pin: a release tag (never "main"). Bump this, then re-run the sync.
const PIN = { repo: "miqdadbadjuber/anti-slop", ref: "v3.2.21" };

// What gets mirrored, verbatim. Everything else upstream (assets, cli,
// plugin manifests) is intentionally skipped. The upstream version literal
// lives in skills/antislop/VERSION and is recorded in the lock.
const PREFIXES = ["skills/", "rules/"];
const EXACT = ["antislop.md"];
const VERSION_PATH = "skills/antislop/VERSION";

// Managed paths are fully owned by this tool: re-written on sync, checked on
// --check, and never touched by hand. LICENSE / README.md are ours (authored,
// not mirrored) and are left alone.
const MANAGED_DIRS = ["skills", "rules"];
const MANAGED_FILES = EXACT;
const MIN_FILES = 6; // fail closed if upstream shape collapses

const die = (code, msg) => {
  console.error(`sync-antislop: ${msg}`);
  process.exit(code);
};

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

function api(path) {
  const headers = {
    "User-Agent": "kelir-mcp-sync",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return fetch(`https://api.github.com${path}`, { headers });
}

async function apiJson(path) {
  const res = await api(path);
  if (!res.ok) {
    const hint =
      res.status === 403 || res.status === 429
        ? " (rate limited - set GITHUB_TOKEN to raise the limit)"
        : "";
    die(
      2,
      `GitHub API ${res.status} for ${path}${hint}.\n` +
        "  Sync needs network + a valid pin; run it where GitHub is reachable.",
    );
  }
  return res.json();
}

// Walk the managed paths on disk, returning repo-relative style keys
// (POSIX separators) that this tool is expected to own.
function walkManaged(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walkManaged(abs, acc);
    else acc.push(abs);
  }
  return acc;
}

function localKeys() {
  const keys = [];
  for (const d of MANAGED_DIRS) {
    const abs = join(mirrorDir, d);
    if (existsSync(abs)) {
      for (const f of walkManaged(abs)) {
        keys.push(relative(mirrorDir, f).split(sep).join("/"));
      }
    }
  }
  for (const f of MANAGED_FILES) {
    if (existsSync(join(mirrorDir, f))) keys.push(f);
  }
  return keys.sort();
}

function writeMirrorFile(rel, buf) {
  const abs = join(mirrorDir, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, buf);
}

function readLock() {
  if (!existsSync(lockPath)) {
    die(
      2,
      `lock not found at ${lockPath}.\n` +
        "  Run `node kelir-mcp/tools/sync-antislop.mjs` (from the kit root) first.",
    );
  }
  return JSON.parse(readFileSync(lockPath, "utf8"));
}

async function sync() {
  const head = await apiJson(`/repos/${PIN.repo}/commits/${PIN.ref}`);
  const commit = head.sha;
  const tree = await apiJson(
    `/repos/${PIN.repo}/git/trees/${commit}?recursive=1`,
  );
  if (tree.truncated) {
    die(2, "upstream tree is truncated; cannot mirror reliably.");
  }

  const wanted = tree.tree
    .filter(
      (n) =>
        n.type === "blob" &&
        (PREFIXES.some((p) => n.path.startsWith(p)) || EXACT.includes(n.path)),
    )
    .sort((a, b) => (a.path < b.path ? -1 : 1));

  if (wanted.length < MIN_FILES) {
    die(
      2,
      `only ${wanted.length} mirrored files at ${PIN.ref} (expected >= ${MIN_FILES}).\n` +
        "  Upstream layout may have changed; review before trusting the mirror.",
    );
  }

  // Fresh managed paths: drop the old tree so removed files do not linger.
  for (const d of MANAGED_DIRS) rmSync(join(mirrorDir, d), { recursive: true, force: true });
  for (const f of MANAGED_FILES) rmSync(join(mirrorDir, f), { force: true });

  const files = {};
  for (const node of wanted) {
    const blob = await apiJson(`/repos/${PIN.repo}/git/blobs/${node.sha}`);
    const buf = Buffer.from(blob.content, "base64");
    writeMirrorFile(node.path, buf);
    files[node.path] = { blob: node.sha, sha256: sha256(buf) };
  }

  const version = (readFileSync(join(mirrorDir, VERSION_PATH), "utf8") || "").trim();

  const lock = {
    repo: PIN.repo,
    ref: PIN.ref,
    commit,
    version,
    files: Object.fromEntries(
      Object.entries(files).sort(([a], [b]) => (a < b ? -1 : 1)),
    ),
  };
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);

  console.log(
    `sync-antislop: OK - ${wanted.length} file dari ${PIN.repo}@${PIN.ref} ` +
      `(commit ${commit.slice(0, 9)}, v${version}) -> kelir-mcp/antislop/`,
  );
}

function check() {
  const lock = readLock();

  const expected = Object.keys(lock.files).sort();
  const present = localKeys();
  const missing = expected.filter((p) => !present.includes(p));
  const extra = present.filter((p) => !expected.includes(p));

  const drift = [
    ...missing.map((p) => `hilang: ${p}`),
    ...extra.map((p) => `tak terdaftar di lock: ${p}`),
  ];

  for (const rel of expected) {
    const abs = join(mirrorDir, rel);
    if (!existsSync(abs)) continue;
    const got = sha256(readFileSync(abs));
    if (got !== lock.files[rel].sha256) drift.push(`berubah: ${rel}`);
    if (readFileSync(abs, "utf8").includes("\r\n")) {
      drift.push(`CRLF (harus LF): ${rel}`);
    }
  }

  if (drift.length > 0) {
    console.error(`sync-antislop: DRIFT - ${drift.length} masalah`);
    for (const d of drift) console.error(`  - ${d}`);
    console.error(
      "  Mirror tidak boleh disunting tangan; jalankan `node kelir-mcp/tools/sync-antislop.mjs`.",
    );
    process.exit(1);
  }

  console.log(
    `sync-antislop: OK - ${expected.length} file cocok dengan lock ` +
      `(${lock.repo}@${lock.ref}, v${lock.version}).`,
  );
}

const args = process.argv.slice(2);
if (args.includes("--check")) check();
else if (args.length === 0) await sync();
else die(2, `argumen tak dikenal: ${args.join(" ")} (pakai --check atau tanpa argumen).`);
