# kelir-mcp — MCP server resmi Kelir (v1)

> Status: in progress. v1 serves a read-only catalog; `suggest` (v1.1)
> and `lint` (v1.2) are planned next. Local stdio use only, and the
> served catalog is a generated copy that can lag behind the newest kit.

Stdio MCP server so AI assistants understand user wishes and apply the best
suggestion within the sealed contract, without reading the whole repo
(kit issue #49). v1 is read-only: three resources + one prompt.
`suggest`/`lint` tools follow in v1.1/v1.2.

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

## Resources / prompts

- `kelir://components` — catalog: name + one-line description + allowed
  props prose per component (source: STYLE.md §5 + kit README).
- `kelir://tokens` — themes, space scale, container, section gap,
  breakpoint (768px), z-index, motion durations per family, status
  colors, shadows.
- `kelir://contract` — sealed-contract summary (§5–§6), including the
  MUI-base rule: every UI component comes from Kelir, MUI is the kit's
  base (not a ban), and non-component MUI use (icons, hooks) stays fine.
- Prompt `design-flow` — design, pick ONE sealed component, verify contract.

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
`design-flow` retrievable, snapshot deterministic.

## Files

- `server.mjs` — wiring only (`createKelirServer` factory; stdio connect
  runs only when invoked directly, so tests/tools can import it).
- `snapshot.json` — generated, committed (do not edit by hand).
- `tools/snapshot.mjs` — zero-dep text parser (same §5-table pattern as
  `kelir-drift.mjs`); fail-closed on unknown shapes.
- `tools/test.mjs` — conformance + determinism.
