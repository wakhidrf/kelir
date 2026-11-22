import type * as React from "react";
import type { KitAlign } from "./kit-align";
import type { KitIdentity } from "./kit-tone";

// 34. Kbd
// 34. Kbd — sealed keyboard key (Gel.3c STYLE.md §6).
// `children` key text. No ...rest/style/sx/className.
export interface KbdProps {
  children: string;
  id?: string;
  "aria-label"?: string;
}

// 62. Tooltip
// 62. Tooltip — sealed hover info based on MUI (Gel.3c-4 STYLE.md §6).
// `title` TEXT; `children` trigger element. consumer-merge slotProps removed
// — tooltip visuals fully owned by the kit. No ...rest/style/sx/slotProps.
export interface TooltipProps {
  title: string;
  children: React.ReactElement;
  id?: string;
  "aria-label"?: string;
}

// 63. Typography — sealed text based on MUI (P1c STYLE.md §6).
// `variant` = VISUAL hierarchy (kit-owned closed union); `as`/`level` =
// DOCUMENT hierarchy (correct heading element; document hierarchy ≠ visual);
// `align` = TEXT alignment (closed union; default `left`, no visual change).
// `truncate?` = kit-owned single-line ellipsis (default `false`).
// No style/sx/className/raw colors/fonts — everything from kit tokens.
export type TypographyVariant =
  | "hero"
  | "hero-sm"
  | "display"
  | "title"
  | "h1"
  | "h2"
  | "h3"
  | "stat"
  | "body-md"
  | "body-sm"
  | "caption"
  | "label-caps"
  | "label";

export interface TypographyProps {
  children?: React.ReactNode;
  variant?: TypographyVariant;
  variantMd?: TypographyVariant;
  // Variant below 600px (token layout.mobile) - mirrors `variantMd` for
  // heading scale that shrinks on phones (e.g. hero -> hero-sm).
  variantMobile?: TypographyVariant;
  // Text color from theme tokens (primary/secondary) or brand identity
  // (brand-accent/brand-ink from KelirProvider.brandColors); none = the
  // variant's default color. Subset of KitIdentity (text-tone roles).
  tone?: Extract<
    KitIdentity,
    "primary" | "secondary" | "brand-accent" | "brand-ink"
  >;
  // Identity font: text = the active theme's font (default), brand = the
  // brand font registered via KelirProvider.brandFont.
  font?: "text" | "brand";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: KitAlign;
  truncate?: boolean;
  breakAll?: boolean;
  tracking?: "normal" | "wide";
  segments?: TypographySegment[];
  id?: string;
  "aria-label"?: string;
}

// Inline text segments with tokens for Typography (one heading element,
// not nested headings; `break` = <br/>). `tone` (muted/primary) & `scale`
// (sm = 0.55em + weight 500, md = default) from kit tokens.
export interface TypographySegment {
  text?: string;
  tone?: Extract<KitIdentity, "muted" | "primary">;
  scale?: "sm" | "md";
  break?: boolean;
}