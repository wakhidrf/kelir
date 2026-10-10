import MuiButtonGroup from "@mui/material/ButtonGroup";
import type { ButtonGroupProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function ButtonGroup({
  children,
  disabled,
  id,
  "aria-label": ariaLabel,
}: ButtonGroupProps) {
  return (
    <MuiButtonGroup
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      sx={{
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.sm,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        color: css.colors.textPrimary,
        fontFamily: "inherit",
        gap: css.layout.space.sm,
      }}
    >
      {children}
    </MuiButtonGroup>
  );
}
