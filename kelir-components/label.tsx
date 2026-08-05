import MuiInputLabel from "@mui/material/InputLabel";
import type { LabelProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;

export function Label({ children, style, ...props }: LabelProps) {
  return (
    <MuiInputLabel
      {...props}
      shrink
      disableAnimation
      style={{
        position: "static",
        transform: "none",
        margin: "0 0 6px",
        fontSize: "14px",
        fontWeight: 600,
        color: textPrimary,
        fontFamily: "inherit",
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </MuiInputLabel>
  );
}
