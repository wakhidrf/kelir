import MuiBox from "@mui/material/Box";
import type { QuoteProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Kutipan blok sealed (P2 STYLE.md 6): batang aksen, latar, radius, dan
// bayangan milik kit. Basis MUI (MuiBox = blockquote + emotion + tema di
// tree). Tanpa ...rest ke DOM, tanpa style/sx/className passthrough.
export function Quote({ children, id, "aria-label": ariaLabel }: QuoteProps) {
  return (
    <MuiBox
      component="blockquote"
      id={id}
      aria-label={ariaLabel}
      sx={{
        margin: 0,
        padding: `${css.layout.space.md} ${css.layout.space.lg}`,
        borderLeft: `4px solid ${css.colors.primary}`,
        borderRadius: `0 ${css.radius.prominent} ${css.radius.prominent} 0`,
        backgroundColor: css.colors.surface,
        color: css.colors.textPrimary,
        boxShadow: css.shadows.convex,
        fontFamily: "inherit",
      }}
    >
      {children}
    </MuiBox>
  );
}
