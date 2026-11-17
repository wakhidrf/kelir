import MuiCheckbox from "@mui/material/Checkbox";
import type { CheckboxProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Binary choice sealed (Gel.2 STYLE.md §6): MUI-based; semantic `onChange`
// (boolean, not event); label text slot owned by the kit. No ...rest,
// no consumer style/sx.
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
        // MUI v9: input attributes via slotProps.input (inputProps is deprecated).
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
