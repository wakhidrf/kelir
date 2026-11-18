// kelir-config.mjs - per-project gate configuration (issue #116).
//
// A consumer project opts out of WARN rules that are its legitimate style:
//
//   <project>/.kelirrc        (JSON; .kelirrc.json also accepted)
//   { "kelir-guard": { "warn": ["style", "heuristic-slot"] } }
//
// Suppressed findings are reported as ALLOW (never silent) with the reason
// ".kelirrc". ERROR rules cannot be suppressed: only the "warn" level is
// accepted, so a typo or an attempt to hide an error is reported instead of
// silently ignored.
//
// Usage from a gate:
//   import { loadConfig, suppressedBy } from "./kelir-config.mjs";
//   const config = loadConfig();                  // --no-config disables
//   if (config.error) { console.error(config.error); process.exit(2); }
//   for (const note of config.invalid) console.warn(`kelir: ${note}`);
//
// No dependencies.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// scripts/ -> kelir/ -> views/ -> src/ -> <project>
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");

const CANDIDATES = [".kelirrc", ".kelirrc.json"];
const SUPPRESSIBLE_LEVELS = new Set(["warn"]);

// First existing config file in the project root, or null.
export function configPath(root = ROOT) {
  for (const name of CANDIDATES) {
    const path = join(root, name);
    if (existsSync(path)) return path;
  }
  return null;
}

// Parse the project config. Returns:
//   { path, warn: Map<gate, Set<rule>>, invalid: string[], error?: string }
// `error` is set only when the file exists but cannot be used (the caller
// should exit 2); `invalid` collects recoverable mistakes (unknown level or a
// malformed rule list) that the caller should surface without aborting.
export function loadConfig({ root = ROOT, enabled = true } = {}) {
  const path = enabled ? configPath(root) : null;
  if (!path) return { path: null, warn: new Map(), invalid: [] };

  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch (e) {
    return { path, warn: new Map(), invalid: [], error: `cannot read ${path}: ${e.message}` };
  }

  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    return { path, warn: new Map(), invalid: [], error: `invalid JSON in ${path}: ${e.message}` };
  }

  if (json === null || typeof json !== "object" || Array.isArray(json)) {
    return {
      path,
      warn: new Map(),
      invalid: [],
      error: `invalid ${path}: expected a JSON object keyed by gate`,
    };
  }

  const warn = new Map();
  const invalid = [];
  for (const [gate, body] of Object.entries(json)) {
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      invalid.push(`${gate}: expected an object like { "warn": ["rule-id"] }`);
      continue;
    }
    for (const [level, rules] of Object.entries(body)) {
      if (!SUPPRESSIBLE_LEVELS.has(level)) {
        invalid.push(`${gate}.${level}: only "warn" can be suppressed; ERROR rules stay visible`);
        continue;
      }
      if (!Array.isArray(rules) || rules.some((r) => typeof r !== "string")) {
        invalid.push(`${gate}.${level}: expected an array of rule ids`);
        continue;
      }
      const set = warn.get(gate) ?? new Set();
      for (const rule of rules) set.add(rule);
      warn.set(gate, set);
    }
  }
  return { path, warn, invalid };
}

// True when `rule` of `gate` is suppressed for this project.
export function suppressedBy(config, gate, rule) {
  return config?.warn?.get(gate)?.has(rule) === true;
}

// "..." reason stored on suppressed rows (always visible in the report).
export const CONFIG_REASON = ".kelirrc";