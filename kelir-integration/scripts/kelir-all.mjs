// kelir-all.mjs - run Kelir gates without short-circuiting (issue #116).
//
//   node src/views/kelir/kelir-integration/scripts/kelir-all.mjs [--profile=ui|extra|all]
//                                              [--only=<gate>]... [--list]
//                                              [--strict] [--fix] [--scope=views,app]
//
// `npm run kelir` used to chain the gates with `&&`, so the first red gate
// hid the rest. This runner runs the selected gates in order, prints every
// report, then one combined table, and exits 1 when any gate failed.
//
// Profiles (issue #123 follow-up: split by concern):
//   ui    - UI contract gates only (kelir-guard, kelir-hunt, kelir-slop).
//           `npm run kelir`.
//   extra - non-UI tooling (kelir-swr, kelir-perf) + code hygiene
//           (kelir-alias, kelir-bury, kelir-split, kelir-barrel). `npm run kelir:extra`.
//   all   - every gate (default; backward compatible).
//
// `--only=<gate>` (repeatable) overrides the profile's selection; `--list`
// prints the gate order without running. Arguments are forwarded to every
// gate, so gate flags work unchanged (`--fix`, `--dry-run`, `--scope=`, ...).
//
// The runner always adds `--strict`: a gate without it prints FAIL and still
// exits 0, which would make the summary disagree with the report above it.
//
// No dependencies.
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BOLD, RESET, printTable } from "./kelir-report.mjs";
import { TOOLS_VERSION } from "./kelir-version.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

// Layout (scripts are grouped by concern):
//   scripts/kelir-all.mjs      this runner (the single entry point)
//   scripts/kelir-report.mjs   shared table reporter (uniform GATE/FINDINGS/SCOPE)
//   scripts/kelir-version.mjs  shared TOOLS_VERSION
//   scripts/kelir-config.mjs   shared .kelirrc loader
//   scripts/ui/                UI contract gates  (profile ui / `npm run kelir`)
//   scripts/tooling/           non-UI gates + hygiene (profile extra / `npm run kelir:extra`)
//
// Lives at <project>/src/views/kelir/kelir-integration/scripts.
const GATES = [
  { id: "kelir-guard", file: "ui/kelir-guard.mjs", checks: "patent contract", profiles: ["ui", "all"] },
  { id: "kelir-hunt", file: "ui/kelir-hunt.mjs", checks: "adoption outside the kit", profiles: ["ui", "all"] },
  { id: "kelir-slop", file: "ui/kelir-slop.mjs", checks: "anti-slop rules", profiles: ["ui", "all"] },
  { id: "kelir-alias", file: "tooling/kelir-alias.mjs", checks: "absolute imports", profiles: ["extra", "all"] },
  { id: "kelir-bury", file: "tooling/kelir-bury.mjs", checks: "dead exports and files", profiles: ["extra", "all"] },
  { id: "kelir-split", file: "tooling/kelir-split.mjs", checks: "file length", profiles: ["extra", "all"] },
  { id: "kelir-barrel", file: "tooling/kelir-barrel.mjs", checks: "barrel files", profiles: ["extra", "all"] },
  { id: "kelir-swr", file: "tooling/kelir-swr.mjs", checks: "SWR misuse", profiles: ["extra", "all"] },
  { id: "kelir-perf", file: "tooling/kelir-perf.mjs", checks: "Next.js performance", profiles: ["extra", "all"] },
];

const PROFILES = ["ui", "extra", "all"];

const argv = process.argv.slice(2);
const profileArg = argv.find((a) => a.startsWith("--profile="))?.slice("--profile=".length);
const only = argv
  .filter((a) => a.startsWith("--only="))
  .map((a) => a.slice("--only=".length));
const forward = argv.filter(
  (a) => !a.startsWith("--only=") && !a.startsWith("--profile=") && a !== "--list",
);
if (!forward.includes("--strict")) forward.push("--strict");

if (profileArg && !PROFILES.includes(profileArg)) {
  console.error(`kelir-all: unknown profile '${profileArg}'.`);
  console.error(`Available profiles: ${PROFILES.join(", ")}`);
  process.exit(2);
}
const profile = profileArg ?? "all";

if (argv.includes("--list")) {
  printTable(
    [
      { key: "id", label: "GATE" },
      { key: "profiles", label: "PROFILES" },
      { key: "checks", label: "CHECKS" },
    ],
    GATES.map((g) => ({ id: g.id, profiles: g.profiles.join(", "), checks: g.checks })),
    "(no gates)",
  );
  process.exit(0);
}

for (const id of only) {
  if (!GATES.some((g) => g.id === id)) {
    console.error(`kelir-all: unknown gate '${id}'.`);
    console.error(`Available gates: ${GATES.map((g) => g.id).join(", ")}`);
    process.exit(2);
  }
}

const inProfile = GATES.filter((g) => g.profiles.includes(profile));
const selected = only.length > 0 ? GATES.filter((g) => only.includes(g.id)) : inProfile;
const results = [];

console.log(BOLD + `kelir-all v${TOOLS_VERSION}` + RESET);
console.log(
  `Profile: ${profile} (${selected.length} gate(s))` +
    (forward.length > 0 ? ` with ${forward.join(" ")}` : "") +
    ".",
);
console.log("");

for (const gate of selected) {
  const run = spawnSync(process.execPath, [join(HERE, gate.file), ...forward], {
    stdio: "inherit",
  });
  results.push({ gate: gate.id, status: run.status === 0 ? "OK" : "FAIL", exit: run.status });
}

const failed = results.filter((r) => r.status !== "OK");

console.log("");
console.log(BOLD + "SUMMARY" + RESET);
printTable(
  [
    { key: "gate", label: "GATE" },
    { key: "status", label: "STATUS" },
    { key: "exit", label: "EXIT" },
  ],
  results.map((r) => ({
    gate: r.gate,
    status: r.status,
    exit: r.exit === null ? "spawn error" : r.exit,
  })),
);

if (failed.length > 0) {
  console.log("");
  console.log(`${failed.length} gate(s) failed: ${failed.map((r) => r.gate).join(", ")}`);
  process.exit(1);
}