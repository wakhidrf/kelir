# Anti-slop mirror (do not edit)

This folder is a **pinned mirror** of the upstream [anti-slop](https://github.com/miqdadbadjuber/anti-slop)
rulebook ("Anti Slop: Rules for AI Coding Agents" by Miqdad Badjuder, MIT).
It is vendored here so the Kelir MCP can apply the same filter offline and
deterministically. Nothing in this folder is hand-written Kelir code.

## Source and pin

| Field | Value |
|---|---|
| Repository | `https://github.com/miqdadbadjuber/anti-slop` |
| Ref (tag) | `v3.2.21` |
| Commit | `77e1920ad5e540816ccec3b2142128d95ef12bcb` |
| Upstream version | `3.2.21` (see `VERSION`) |
| License | MIT (see `LICENSE`, kept verbatim) |

The exact pinned ref, commit, and a sha256 per mirrored file live in
`upstream.lock.json` (written by the sync tool, F1).

## Rule: mirror, never fork

- **Do not edit** any file under `antislop/` by hand. Edits are lost on the
  next sync and would silently diverge from upstream.
- To update, bump the pin and run the sync tool from the kit root:

  ```sh
  node kelir-mcp/tools/sync-antislop.mjs          # refresh the mirror
  node kelir-mcp/tools/sync-antislop.mjs --check  # CI: fail on drift
  node kelir-mcp/tools/build-antislop-index.mjs   # regenerate index.json
  ```

- `skills/**`, `rules/antislop.md`, `VERSION`, and `LICENSE` are copied
  verbatim from the pinned ref. Content that is not part of the filter
  (assets, CLI, plugin manifests) is intentionally not mirrored.

## What the MCP does with it

- `antislop/index.json` (generated) is a structured rule index derived from
  the mirrored `SKILL.md` files (F2/F3).
- The MCP exposes the filter as the `kelir://antislop` resource and applies
  it in `suggest` / `audit`, so agents filter generic AI-slop patterns before
  shipping Kelir components and copy.
