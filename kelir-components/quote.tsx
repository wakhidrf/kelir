import MuiBox from "@mui/material/Box";
import type { QuoteProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Kutipan blok sealed (P2 STYLE.md 6): batang aksen, latar, radius, dan
// bayangan milik kit. Basis MUI (MuiBox = blockquote + emotion + tema di
// tree). Tanpa ...rest ke DOM, tanpa style/sx/className passthrough.
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
