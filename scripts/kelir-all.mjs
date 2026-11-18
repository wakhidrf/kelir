// kelir-all.mjs - run every Kelir gate without short-circuiting (issue #116).
//
//   node src/views/kelir/scripts/kelir-all.mjs [--strict] [--fix] [--scope=views,app]
//
// `npm run kelir` used to chain the six gates with `&&`, so the first red gate
// hid the rest (a pre-existing kelir-split debt stopped guard/hunt/slop from
// running). This runner runs all six in order, prints every report, then one
// combined table, and exits 1 when any gate failed.
//
// Arguments are forwarded to every gate, so gate flags work unchanged
// (`--fix`, `--dry-run`, `--scope=`, ...). `--only=<gate>` runs a subset
// (repeatable) and `--list` prints the gate order without running.
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

const GATES = [
  { id: "kelir-alias", file: "kelir-alias.mjs", checks: "absolute imports" },
  { id: "kelir-bury", file: "kelir-bury.mjs", checks: "dead exports and files" },
  { id: "kelir-split", file: "kelir-split.mjs", checks: "file length" },
  { id: "kelir-guard", file: "kelir-guard.mjs", checks: "patent contract" },
  { id: "kelir-hunt", file: "kelir-hunt.mjs", checks: "adoption outside the kit" },
  { id: "kelir-slop", file: "kelir-slop.mjs", checks: "anti-slop rules" },
];

const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith("--only=")).map((a) => a.slice("--only=".length));
const forward = argv.filter((a) => !a.startsWith("--only=") && a !== "--list");
if (!forward.includes("--strict")) forward.push("--strict");

if (argv.includes("--list")) {
  printTable(
    [
      { key: "id", label: "GATE" },
      { key: "checks", label: "CHECKS" },
    ],
    GATES.map((g) => ({ id: g.id, checks: g.checks })),
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

const selected = only.length > 0 ? GATES.filter((g) => only.includes(g.id)) : GATES;
const results = [];

console.log(BOLD + `kelir-all v${TOOLS_VERSION}` + RESET);
console.log(
  `Running ${selected.length} gate(s)${forward.length > 0 ? ` with ${forward.join(" ")}` : ""}.`,
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