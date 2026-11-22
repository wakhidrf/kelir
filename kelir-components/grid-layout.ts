import { css } from "../kelir-kit/kit-create-css";

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

// Kit responsive thresholds (single source: layout tokens) - `mobile` 600px for
// `columnsSm`, `heroCollapse` 768px for `columnsMd`. The md rule is written
// after sm so it wins when both match.
export const SM_QUERY = `@media (min-width: ${css.layout.breakpoints.mobile})`;
export const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

export const columnsCss = (n: number) => `repeat(${n}, minmax(0, 1fr))`;

// Aside panel: fixed width from the kit scale + collapse threshold (900px =
// internal Sidebar threshold so aside & shell collapse together).
export const asideWidths = { sm: 240, md: 280, lg: 320 } as const;
export const collapsePx = { md: css.layout.breakpoints.heroCollapse, lg: "900px" } as const;
export const PIN_HEIGHT = 680;
export const PIN_MAX = "calc(100dvh - 48px)";

// Auto-fit: column count follows container width with minimum item width
// from tokens (no media query - inline is enough).
export const autoFitCss = (minItem: "sm" | "md") =>
  `repeat(auto-fit, minmax(${css.layout.gridMin[minItem]}, 1fr))`;