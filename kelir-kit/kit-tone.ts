// Canonical tone vocabulary (P1c STYLE.md §6): one source of truth so no
// component invents its own color spelling (danger vs error, warn vs warning,
// accent vs brand-accent). Two intentional axes, each with its own union:
//
//   KitStatus   - semantic status colors (Alert/Toast). The "what happened" axis.
//   KitIdentity - surface/brand/text roles (Icon/Tile/Marker/Typography). The
//                 "which visual role" axis; never a status color.
//
// Each `tone?` prop types itself as a subset of ONE axis (via Extract) matching
// the roles it supports, so the allowed spellings stay kit-owned while the prop
// still documents exactly what it accepts. Closed unions, no free strings.
export type KitStatus = "info" | "success" | "warning" | "error";

// Visual/identity roles. Superset of every non-status tone in the kit:
//   primary/secondary  = theme accent surfaces
//   accent             = brand accent (alias of primary in some contexts)
//   neutral            = text/surface neutral role (Banner/Empty)
//   plain              = borderless-on-surface (Tile)
//   inherit            = currentColor (Icon)
//   brand-accent/ink   = KelirProvider.brandColors text tones (Typography)
//   muted              = de-emphasized inline text (Typography segments)
export type KitIdentity =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "plain"
  | "inherit"
  | "brand-accent"
  | "brand-ink"
  | "muted";