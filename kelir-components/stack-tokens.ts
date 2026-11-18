import type { StackProps } from "../kelir-types";
import { css } from "../kelir-variants";

export const gaps = {
  xs: css.layout.space.xs,
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
  xl: css.layout.space.xl,
  "2xl": css.layout.space["2xl"],
  "3xl": css.layout.space["3xl"],
  "4xl": css.layout.space["4xl"],
} as const;

// Kit responsive breakpoint (single source: the heroCollapse token, 768px). Used via
// `sx` so the component stays server-safe (no hooks/useMediaQuery).
export const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

// `minHeight="screen"` = one full screen (dvh so it's correct on mobile).
export const SCREEN_HEIGHT = "100dvh";

export function minHeightValue(
  minHeight: NonNullable<StackProps["minHeight"]>,
): string {
  return minHeight === "screen" ? SCREEN_HEIGHT : css.layout.space[minHeight];
}