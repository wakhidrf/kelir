import MuiBox from "@mui/material/Box";
import type { BadgeProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Badge({
  variant = "primary",
  children,
  id,
  "aria-label": ariaLabel,
}: BadgeProps) {
  const palette =
    variant === "primary"
      ? { bg: css.colors.primary, fg: css.on.primary }
      : variant === "secondary"
        ? { bg: css.colors.secondary, fg: css.on.secondary }
        : variant === "destructive"
          ? { bg: css.destructive, fg: css.on.destructive }
          : null;
  return (
    <MuiBox
      component="span"
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${css.layout.space.xs} 10px`,
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 600,
        fontFamily: "inherit",
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        backgroundColor: palette ? palette.bg : css.colors.surface,
        color: palette ? palette.fg : css.colors.textPrimary,
      }}
    >
      {children}
    </MuiBox>
  );
}
