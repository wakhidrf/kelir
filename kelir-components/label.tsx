import MuiInputLabel from "@mui/material/InputLabel";
import type { LabelProps } from "../kelir-kit/kit-forms-input";
import { css } from "../kelir-kit/kit-create-css";

export function Label({
  children,
  htmlFor,
  id,
  "aria-label": ariaLabel,
}: LabelProps) {
  return (
    <MuiInputLabel
      htmlFor={htmlFor}
      id={id}
      aria-label={ariaLabel}
      shrink
      disableAnimation
      sx={{
        position: "static",
        transform: "none",
        margin: "0 0 6px",
        fontSize: "14px",
        fontWeight: 600,
        color: css.colors.textPrimary,
        fontFamily: "inherit",
        lineHeight: 1.2,
      }}
    >
      {children}
    </MuiInputLabel>
  );
}
