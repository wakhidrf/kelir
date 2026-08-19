import MuiCheckbox from "@mui/material/Checkbox";
import type { CheckboxProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={props.id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <MuiCheckbox
        {...props}
        sx={{
          color: textSecondary,
          "&.Mui-checked": {
            color: css.colors.textPrimary,
          },
          "&.Mui-checked:hover": {
            color: css.colors.textPrimary,
          },
          ...props.sx,
        }}
        style={props.style}
      />
      {label && (
        <span style={{ color: textPrimary, fontSize: "14px" }}>{label}</span>
      )}
    </label>
  );
}
