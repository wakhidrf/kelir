import MuiBox from "@mui/material/Box";
import type { KbdProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Kbd({ children, id, "aria-label": ariaLabel }: KbdProps) {
  return (
    <MuiBox
      component="kbd"
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "26px",
        padding: `${css.layout.space.xs} 9px`,
        borderRadius: css.layout.space.sm,
        backgroundColor: css.colors.surface,
        border: `1px solid ${css.border.light}`,
        boxShadow: css.shadows.convex,
        color: css.colors.textPrimary,
        fontFamily: "inherit",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </MuiBox>
  );
}
