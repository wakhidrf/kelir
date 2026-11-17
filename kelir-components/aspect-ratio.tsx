import MuiBox from "@mui/material/Box";
import type { AspectRatioProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Kit phone breakpoint (single source: layout.mobile token 600px).
const MOBILE_QUERY = `@media (max-width: calc(${css.layout.breakpoints.mobile} - 0.02px))`;

// AspectRatio sealed (Gel.3c-6 STYLE.md §6): kit-owned ratio frame,
// children media slot. `plain?` = no kit surface (logo/illustration);
// `maxWidth?` (px, all widths) + `maxWidthMobileVw?` (vw below 600px)
// cap the frame width - replaces consumer class max-width. When
// `maxWidthMobileVw` is set, the width cap moves to `sx` so the media query
// can override the desktop cap (inline style always beats stylesheet).
// No consumer style/sx/className.
export function AspectRatio({
  ratio = 16 / 9,
  children,
  plain = false,
  maxWidth,
  maxWidthMobileVw,
}: AspectRatioProps) {
  const responsive = maxWidthMobileVw !== undefined;
  return (
    <MuiBox
      sx={
        responsive
          ? {
              ...(maxWidth !== undefined ? { maxWidth } : null),
              [MOBILE_QUERY]: { maxWidth: `${maxWidthMobileVw}vw` },
            }
          : undefined
      }
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${ratio}`,
        ...(responsive || maxWidth === undefined ? null : { maxWidth }),
        ...(plain
          ? null
          : {
              backgroundColor: css.colors.surface,
              borderRadius: css.radius.card,
              boxShadow: css.shadows.convex,
              border: `1px solid ${css.border.light}`,
            }),
        overflow: "hidden",
      }}
    >
      <MuiBox style={{ position: "absolute", inset: 0 }}>{children}</MuiBox>
    </MuiBox>
  );
}
