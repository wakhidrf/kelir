import MuiBox from "@mui/material/Box";
import type { ImageProps } from "../kelir-types";
import { css } from "../kelir-variants";

const heights = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  "2xl": 128,
  "3xl": 160,
  "4xl": 200,
  "5xl": 256,
  "6xl": 320,
  "7xl": 400,
} as const;

const radii = {
  none: "0",
  sm: css.radius.sm,
  md: css.radius.md,
  lg: css.radius.lg,
} as const;

// Pure logic (not DOM): maps height MEANING → kit px.
// Unit-tested directly - jsdom does not compute emotion stylesheets.
export function imagePx(height: NonNullable<ImageProps["height"]>): number {
  return heights[height];
}

// Sealed neutral media (P1b STYLE.md): height from a closed union (width follows
// the original ratio), contain/cover fit, radius token (default none).
// `fluid?` = width fills the container + auto height (original ratio preserved)
// for decorative/hero media; `maxHeight?` limits height from the same scale;
// `maxWidth?` limits width in px (TruncatedText.maxWidth precedent).
// `fill?` = fills a positioned container fully (e.g. inside AspectRatio);
// `priority?` = eager loading + high fetchPriority; `sizes?` = display size hint
// for source selection.
// `alt` is always rendered as an attribute (empty string when unset) so it
// passes axe image-alt. No default shadow/border, no ...rest to DOM and
// no style passthrough - outside the contract = violation.
export function Image({
  src,
  alt,
  height = "md",
  fluid = false,
  maxHeight,
  maxWidth,
  fit = "contain",
  radius = "none",
  fill = false,
  priority = false,
  sizes,
  id,
  "aria-label": ariaLabel,
}: ImageProps) {
  return (
    <MuiBox
      component="img"
      src={src}
      alt={alt ?? ""}
      id={id}
      aria-label={ariaLabel}
      sizes={sizes}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      style={{
        display: "block",
        ...(fill
          ? ({
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            } as const)
          : fluid
            ? ({ width: "100%", height: "auto" } as const)
            : ({ height: heights[height], width: "auto" } as const)),
        maxWidth:
          fill || maxWidth === undefined ? (fill ? "none" : "100%") : maxWidth,
        ...(maxHeight
          ? ({ maxHeight: heights[maxHeight] } as const)
          : null),
        objectFit: fit,
        borderRadius: radii[radius],
      }}
    />
  );
}
