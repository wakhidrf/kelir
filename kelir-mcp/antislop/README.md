# Anti-slop mirror (do not edit)

This folder is a **pinned mirror** of the upstream [anti-slop](https://github.com/miqdadbadjuber/anti-slop)
rulebook ("Anti Slop: Rules for AI Coding Agents" by Miqdad Badjuber, MIT).
It is vendored here so the Kelir MCP can apply the same filter offline and
deterministically. Nothing in this folder is hand-written Kelir code.

## Source and pin

| Field | Value |
|---|---|
| Repository | `https://github.com/miqdadbadjuber/anti-slop` |
| Ref (tag) | `v3.2.21` |
| Commit | `77e1920ad5e540816ccec3b2142128d95ef12bcb` |
| Upstream version | `3.2.21` (`skills/antislop/VERSION`) |
| License | MIT (see `LICENSE`, kept verbatim) |

The exact pinned ref, commit, and a sha256 per mirrored file live in
`upstream.lock.json` (written by the sync tool). `--check` verifies the local
files against that lock.

## Rule: mirror, never fork

- **Do not edit** any file under `antislop/` by hand. Edits are lost on the
  next sync and would silently diverge from upstream.
- To update, bump the pin (`PIN.ref` in `tools/sync-antislop.mjs`, a release
  tag) and run the sync tool from the kit root:

  ```sh
  node kelir-mcp/tools/sync-antislop.mjs          # refresh the mirror (network)
  node kelir-mcp/tools/sync-antislop.mjs --check  # verify local vs lock (offline)
  ```

- `antislop.md`, `rules/**`, and `skills/**` (12 files: the 6 skills plus
  `skills/antislop/VERSION` and the two `antislop-human` helper scripts) are
  copied verbatim from the pinned commit. Everything else upstream (assets,
  `cli/`, plugin manifests, `package.json`) is intentionally not mirrored.
  `LICENSE` and this file are ours, not mirrored.

## What the MCP does with it

- `antislop/index.json` (generated) is a structured rule index derived from
  the mirrored `SKILL.md` files (F2/F3).
- The MCP exposes the filter as the `kelir://antislop` resource and applies
  it in `suggest` / `audit`, so agents filter generic AI-slop patterns before
  shipping Kelir components and copy.
