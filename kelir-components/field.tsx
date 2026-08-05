import MuiFormControl from "@mui/material/FormControl";
import MuiFormHelperText from "@mui/material/FormHelperText";
import type { FieldProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Label } from "./label";

const textSecondary = css.colors.textSecondary;

export function Field({
  label,
  helperText,
  error,
  children,
  style,
  ...props
}: FieldProps) {
  return (
    <MuiFormControl
      {...props}
      error={error}
      fullWidth={props.fullWidth ?? true}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {label && <Label>{label}</Label>}
      {children}
      {helperText && (
        <MuiFormHelperText
          style={{
            margin: 0,
            fontFamily: "inherit",
            fontSize: "12px",
            color: error ? css.destructive : textSecondary,
          }}
        >
          {helperText}
        </MuiFormHelperText>
      )}
    </MuiFormControl>
  );
}
