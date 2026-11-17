import MuiBox from "@mui/material/Box";
import type { StackProps } from "../kelir-types";
import { css } from "../kelir-variants";

const gaps = {
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
const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

// `minHeight="screen"` = one full screen (dvh so it's correct on mobile).
const SCREEN_HEIGHT = "100dvh";

function minHeightValue(
  minHeight: NonNullable<StackProps["minHeight"]>,
): string {
  return minHeight === "screen" ? SCREEN_HEIGHT : css.layout.space[minHeight];
}

// Sealed layout primitive (P1b STYLE.md): arrangement + spacing + alignment from
// css.layout tokens. `align`/`justify` closed union of logical values
// (RTL-correct); default stretch/start = legacy behavior (zero visual change).
// `wrap?` = kit-owned flex-wrap (default `false`, property fully omitted
// when off). `directionMd?` = direction at width >= 768px (the
// heroCollapse token); without = `direction` applies at all widths (legacy behavior).
// `minHeight?` = minimum height from the space token scale or `screen`
// (= 100dvh) for one-screen hero/interstitial (provides fixed space
// for async/third-party content; default no height). `reverseMd?` =
// reverse child order at width >= 768px (heroCollapse token; base direction
// `gapMd?` = gap at width >= 768px (heroCollapse token); without =
// `gap` applies at all widths (legacy behavior).
// `directionMd ?? direction`, default `false`). No color/border/shadow/font.
// MUI base (MuiBox = div + emotion + theme in the tree) for multi-platform;
// visuals owned by the kit. No ...rest to the DOM and no style passthrough —
// outside the contract = violation.
export function Stack({
  children,
  gap = "md",
  direction = "column",
  directionMd,
  gapMd,
  reverseMd = false,
  minHeight,
  align = "stretch",
  justify = "start",
  wrap = false,
  id,
  "aria-label": ariaLabel,
}: StackProps) {
  const responsiveDirection = directionMd !== undefined || reverseMd;
  const responsiveGap = gapMd !== undefined;

  const mdDirection = reverseMd
    ? `${directionMd ?? direction}-reverse`
    : directionMd;
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={
        responsiveDirection || responsiveGap
          ? {
              ...(responsiveDirection
                ? { flexDirection: direction }
                : null),
              [MD_QUERY]: {
                ...(responsiveDirection
                  ? { flexDirection: mdDirection }
                  : null),
                ...(responsiveGap ? { gap: gaps[gapMd] } : null),
              },
            }
          : undefined
      }
      style={{
        display: "flex",
        // Base direction stays inline (legacy behavior); when responsive direction
        // is used, direction moves to `sx` so the media query can take over.
        ...(responsiveDirection ? null : ({ flexDirection: direction } as const)),
        ...(responsiveGap ? null : ({ gap: gaps[gap] } as const)),
        alignItems: align,
        justifyContent: justify,
        ...(minHeight
          ? ({ minHeight: minHeightValue(minHeight) } as const)
          : null),
        ...(wrap ? ({ flexWrap: "wrap" } as const) : null),
      }}
    >
      {children}
    </MuiBox>
  );
}
