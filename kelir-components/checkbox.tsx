import MuiCheckbox from "@mui/material/Checkbox";
import type { CheckboxProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Pilihan biner sealed (Gel.2 STYLE.md §6): basis MUI; `onChange` semantik
// (boolean, bukan event); label slot teks milik kit. Tanpa ...rest,
// tanpa style/sx konsumen.
export function Checkbox({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled = false,
  id,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: disabled ? "default" : "pointer",
        fontFamily: "inherit",
      }}
    >
      <MuiCheckbox
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        id={id}
        // MUI v9: atribut input lewat slotProps.input (inputProps usang).
        slotProps={{ input: { "aria-label": ariaLabel ?? label } }}
        sx={{
          color: textSecondary,
          "&.Mui-checked": {
            color: css.colors.textPrimary,
          },
          "&.Mui-checked:hover": {
            color: css.colors.textPrimary,
          },
        }}
      />
      {label && (
        <span style={{ color: textPrimary, fontSize: "14px" }}>{label}</span>
      )}
    </label>
  );
}
