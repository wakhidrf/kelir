import type * as React from "react";
import type { TypographyProps, TypographySegment } from "../kelir-types";
import { css } from "../kelir-variants";
import { variantStyles } from "./typography-styles";

type Variant = NonNullable<TypographyProps["variant"]>;

export const MOBILE_QUERY = `@media (max-width: calc(${css.layout.breakpoints.mobile} - 0.02px))`;
export const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

export const BRAND_FONT =
  "var(--kelir-font-brand, var(--kelir-font-active, sans-serif))";

export function styleFor(
  variant: Variant,
  tone: TypographyProps["tone"],
  font: TypographyProps["font"],
): React.CSSProperties {
  const style: React.CSSProperties = { ...variantStyles[variant] };
  if (tone === "primary") style.color = css.colors.textPrimary;
  else if (tone === "secondary") style.color = css.colors.textSecondary;
  else if (tone === "brand-accent")
    style.color = "var(--kelir-brand-accent, inherit)";
  else if (tone === "brand-ink")
    style.color = "var(--kelir-brand-ink, inherit)";
  if (font === "brand") style.fontFamily = BRAND_FONT;
  return style;
}

export function segmentStyle(seg: TypographySegment): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (seg.tone === "muted") style.color = css.colors.textSecondary;
  else if (seg.tone === "primary") style.color = css.colors.primary;
  if (seg.scale === "sm") {
    style.fontSize = "0.55em";
    style.fontWeight = 500;
  }
  return style;
}