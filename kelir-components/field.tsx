import MuiFormControl from "@mui/material/FormControl";
import MuiFormHelperText from "@mui/material/FormHelperText";
import type { FieldProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Typography } from "./typography";

export function Field({
  label,
  helperText,
  error,
  children,
  id,
  "aria-label": ariaLabel,
}: FieldProps) {
  return (
    <MuiFormControl
      error={error}
      fullWidth
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "inherit",
      }}
    >
      {label && <Typography variant="label-caps">{label}</Typography>}
      {children}
      {helperText && (
        <MuiFormHelperText
          sx={{
            margin: 0,
            fontFamily: "inherit",
            fontSize: "12px",
            color: error ? css.destructive : css.colors.textSecondary,
          }}
        >
          {helperText}
        </MuiFormHelperText>
      )}
    </MuiFormControl>
  );
}
