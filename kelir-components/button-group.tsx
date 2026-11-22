import MuiButtonGroup from "@mui/material/ButtonGroup";
import type { ButtonGroupProps } from "../kelir-kit/kit-actions";
import { css } from "../kelir-kit/kit-create-css";

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
        borderRadius: css.radius.button,
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
