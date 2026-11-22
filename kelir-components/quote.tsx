import MuiBox from "@mui/material/Box";
import type { QuoteProps } from "../kelir-kit/kit-data-display-text";
import { css } from "../kelir-kit/kit-create-css";

// Sealed block quote (P2 STYLE.md 6): accent bar, background, radius, and
// shadow owned by the kit. MUI base (MuiBox = blockquote + emotion + theme in
// the tree). No ...rest to the DOM, no style/sx/className passthrough.
export function Quote({
  children,
  variant = "default",
  align = "start",
  id,
  "aria-label": ariaLabel,
}: QuoteProps) {
  const plain = variant === "plain";
  return (
    <MuiBox
      component="blockquote"
      id={id}
      aria-label={ariaLabel}
      sx={{
        margin: plain ? "0 auto" : 0,
        padding: plain ? 0 : `${css.layout.space.md} ${css.layout.space.lg}`,
        borderLeft: plain ? "none" : `4px solid ${css.colors.primary}`,
        borderRadius: plain
          ? 0
          : `0 ${css.radius.prominent} ${css.radius.prominent} 0`,
        backgroundColor: plain ? "transparent" : css.colors.surface,
        color: css.colors.textPrimary,
        boxShadow: plain ? "none" : css.shadows.convex,
        fontFamily: "inherit",
        textAlign: align,
        ...(plain
          ? {
              fontStyle: "italic",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              maxWidth: 800,
            }
          : {}),
      }}
    >
      {children}
    </MuiBox>
  );
}
