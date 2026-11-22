// Canonical content alignment (P1c STYLE.md §6): one closed union shared by
// text/content alignment props (Button.align, Card.headerAlign, Quote.align,
// Typography.align) so the spelling and order are always kit-owned. Logical
// values, correct in both LTR and RTL. `justify` is text-only (Typography) and
// is excluded where the prop means "side" (Bubble/Message). Closed union, no
// free strings.
export type KitAlign = "start" | "center" | "end" | "justify";

// Side-only alignment (start/end) for chat bubbles and messages, where
// "justify" and "center" have no meaning.
export type KitSide = Extract<KitAlign, "start" | "end">;