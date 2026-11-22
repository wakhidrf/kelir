import NextImage from "next/image";
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

// Nominal intrinsic size for next/image's srcset + reserved box only. `fluid`
// fills the container width (height auto from the source ratio); the fixed
// modes pin the kit-owned px height. The real layout is set via `style` below.
const FLUID_W = 1600;
const FLUID_H = 900;

// Pure logic (not DOM): maps height MEANING → kit px.
// Unit-tested directly - jsdom does not compute emotion stylesheets.
export function imagePx(height: NonNullable<ImageProps["height"]>): number {
  return heights[height];
}

// Sealed neutral media (P1b STYLE.md): rendered through next/image so consumers
// get responsive srcset/sizes, lazy-loading by default, and a preloaded eager
// fetch for `priority`. height from a closed union (width follows the source
// ratio), contain/cover fit, radius token (default none).
// `fluid?` = width fills the container + auto height (original ratio preserved);
// `maxHeight?`/`maxWidth?` LIMIT the box; `fill?` = fills a positioned container
// fully (e.g. inside AspectRatio); `priority?` = preload the image (eager fetch).
// `alt` is always rendered as an attribute (empty string when unset) so it
// passes axe image-alt. No default shadow/border, no ...rest to DOM and no
// style passthrough - outside the contract = violation.
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
  const h = heights[height];
  const style = {
    objectFit: fit,
    borderRadius: radii[radius],
    ...(maxHeight ? { maxHeight: heights[maxHeight] } : null),
    ...(fill
      ? null
      : fluid
        ? { width: "100%", height: "auto" }
        : { width: "auto", height: h }),
    ...(fill ? null : { maxWidth: maxWidth === undefined ? "100%" : maxWidth }),
  };

  return (
    <NextImage
      src={src}
      alt={alt ?? ""}
      id={id}
      aria-label={ariaLabel}
      {...(fill
        ? { fill: true }
        : fluid
          ? { width: FLUID_W, height: FLUID_H }
          : { width: h, height: h })}
      sizes={sizes}
      preload={priority}
      style={style}
    />
  );
}