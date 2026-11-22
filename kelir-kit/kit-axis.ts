// Canonical axis (P1c STYLE.md §6): one closed union for "horizontal | vertical"
// props (Resizable.directions, Separator.orientation) so the spelling is
// always kit-owned. Logical, direction-agnostic (no left/right). Closed union.
export type KitAxis = "horizontal" | "vertical";