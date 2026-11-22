import MuiBox from "@mui/material/Box";
import type { StackProps } from "../kelir-kit/kit-layout";
import { gaps, MD_QUERY, minHeightValue } from "./stack-tokens";

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
