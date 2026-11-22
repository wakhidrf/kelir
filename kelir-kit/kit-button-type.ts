// Canonical button type (P1c STYLE.md §6): the HTML button type shared by
// Button and IconButton. "reset" is intentionally absent (request via
// kelir-request). Closed union, no free strings.
export type KitButtonType = "button" | "submit";