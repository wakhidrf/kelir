# kelir-mcp — MCP server resmi Kelir (v1.2)

> Status: in progress. v1 serves a read-only catalog; `suggest` (v1.1) and the
> anti-slop filter + `audit` tool (v1.2) are available; `lint` is planned next.
> Local stdio use only, and the served catalog is a generated copy that can lag
> behind the newest kit.

Stdio MCP server so AI assistants understand user wishes and apply the best
suggestion within the sealed contract, without reading the whole repo
(kit issue #49). v1.2: five resources (incl. the anti-slop filter) + one prompt
+ the `suggest` and `audit` tools. `lint` follows.

## Prereqs

- Node >= 18. One-time install inside this folder: `npm install`
  (`node_modules/` is git-ignored; the Next app never imports this folder).

## Use (OpenCode)

`opencode.json`:

```json
{
  "mcp": {
    "kelir": {
      "type": "local",
      "command": ["node", "src/views/kelir/kelir-mcp/server.mjs"],
      "enabled": true
    }
  }
}
```

Paths are relative to the workspace. Keep the server enabled only where
needed: every MCP server adds context.

## Resources / tools / prompts

- `kelir://components` — catalog: name + one-line description + allowed
  props prose per component (source: STYLE.md §5 + kit README).
- `kelir://tokens` — themes, space scale, container, section gap,
  breakpoint (768px), z-index, motion durations per family, status
  colors, shadows.
- `kelir://contract` — sealed-contract summary (§5–§6), including the
  MUI-base rule: every UI component comes from Kelir, MUI is the kit's
  base (not a ban), and non-component MUI use (icons, hooks) stays fine.
- Prompt `design-flow` — design, pick ONE sealed component, verify contract,
  and filter through the anti-slop core (step 0) + Delivery Gate (step 4).
- Tool `suggest` (v1.1) — input `wish` (plain language, e.g. "rapi tombol
  aksi di mobile") + optional `limit`; output ranked sealed candidates
  (name + description + allowed props) with a reminder to read
  `kelir://contract`. Synonyms bridge Indonesian wishes to the English
  descriptions in the catalog; it only ever suggests catalog components,
  never a self-assembled one. Since v1.2 it also returns `antiSlop` matches
  when the wish itself trips a rule.
- `kelir://antislop` (v1.2) — the anti-slop core filter (load always): upstream
  version header + the core `SKILL.md`.
- `kelir://antislop/{skill}` (v1.2) — one sub-skill on demand (ui,
  copywriting, human, layoutmobile, code).
- Tool `audit` (v1.2) — input `text` (copy) and/or `jsx` (code); returns the
  matched anti-slop rules (id, why, severity) plus Kelir component/token
  notes. Deterministic and offline: regex matchers keyed to `index.json`.

## Anti-slop filter (mirror)

The MCP applies the upstream [anti-slop](https://github.com/miqdadbadjuber/anti-slop)
rulebook (MIT, by Miqdad Badjuber) so agents filter generic AI-slop UI, copy,
and code before shipping Kelir components. The rulebook is **vendored** as a
pinned mirror under `antislop/` (offline, deterministic), never fetched at
runtime.

| Field | Value |
|---|---|
| Ref (tag) | `v3.2.21` |
| Commit | `77e1920ad5e540816ccec3b2142128d95ef12bcb` |
| Upstream version | `3.2.21` |
| License | MIT, kept verbatim in `antislop/LICENSE` |
| Lock | `antislop/upstream.lock.json` (commit + sha256 per mirrored file) |

- **Mirror, never fork**: `antislop/**` is generated. Do not edit by hand; a
  sync overwrites it. Update by bumping the pin and re-running the sync tool:

  ```sh
  node kelir-mcp/tools/sync-antislop.mjs               # refresh (network); bump PIN.ref to update
  node kelir-mcp/tools/sync-antislop.mjs --check       # verify local vs lock (offline)
  node kelir-mcp/tools/build-antislop-index.mjs        # rebuild index.json
  node kelir-mcp/tools/build-antislop-index.mjs --check # verify index is current (offline)
  ```

  Edit `PIN.ref` in `tools/sync-antislop.mjs` (a release tag, never a branch)
  to bump; the sync rewrites the files and the lock, and `--check` fails on any
  drift, hand-edit, or CRLF.
- The same matchers serve the host project gate: `scripts/kelir-slop.mjs`
  (run as `npm run kelir:slop:strict`) imports `MATCHERS` from `antislop.mjs`,
  scans the host files that import Kelir plus the kit internals, and fails on
  any ERROR. An explicit `kelir-allow: slop` on a line, or on the line above
  it, is the only exemption.
- `antislop/index.json` (generated: 38 core rules + 114 patterns) is the
  structured rule index; the filter is served as `kelir://antislop` and applied
  in `suggest` / `audit`, and reused by the host anti-slop gate.
- The mirror content is verbatim upstream: `antislop.md`, `rules/**`,
  `skills/**` (12 files). See `antislop/README.md` for the full pin and rules.

## Regenerate after kit changes

```sh
node kelir-mcp/tools/snapshot.mjs   # from the kit root
```

Output is byte-deterministic from sources (no revision stamp, no
timestamp): any commit changes nothing about freshness, and the test
fails closed when sources change without regeneration.

## Test

```sh
node kelir-mcp/tools/test.mjs   # from the kit root
```

End-to-end over real stdio (spawns `server.mjs`): 3 resources readable,
`design-flow` retrievable, `suggest` returns sealed candidates, snapshot
deterministic.

## Files

- `server.mjs` — wiring only (`createKelirServer` factory; stdio connect
  runs only when invoked directly, so tests/tools can import it).
- `antislop.mjs` — anti-slop loader + deterministic `audit` matchers
  (fail-closed against `antislop/index.json`).
- `snapshot.json` — generated, committed (do not edit by hand).
- `tools/snapshot.mjs` — zero-dep text parser (same §5-table pattern as
  `kelir-drift.mjs`); fail-closed on unknown shapes.
- `tools/test.mjs` — conformance + determinism.
- `antislop/` — pinned MIT mirror of the anti-slop rulebook (`antislop.md`,
  `rules/**`, `skills/**`, `LICENSE`, `upstream.lock.json`, `index.json`).
  `do not edit`; regenerate with `tools/sync-antislop.mjs`.
- `tools/sync-antislop.mjs` — vendoring sync + offline `--check` (zero-dep).
- `antislop/index.json` — generated rule index (38 core rules + 114 patterns),
  with gate/severity/target and a line reference per entry.
- `tools/build-antislop-index.mjs` — rebuilds `index.json` from the mirror +
  `--check` (deterministic, offline).
