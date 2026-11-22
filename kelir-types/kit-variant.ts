// Canonical intent/role variant (P1c STYLE.md §6): one closed union shared by
// intent-bearing components (Button, IconButton, Badge) so none invents a
// bespoke variant set. primary/secondary/destructive = solid roles; outline =
// bordered low-emphasis; ghost = borderless low-emphasis. Closed, no free strings.
export type KitVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost";