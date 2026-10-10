import MuiSwitch from "@mui/material/Switch";
import type { SwitchProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;

// Sakelar sealed (Gel.2 STYLE.md §6): basis MUI; `onChange` semantik
// (boolean); label slot teks milik kit. Tanpa ...rest, tanpa style konsumen.
export function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled = false,
  id,
  "aria-label": ariaLabel,
}: SwitchProps) {
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
      <MuiSwitch
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        id={id}
        // MUI v9: atribut input lewat slotProps.input (inputProps usang).
        slotProps={{ input: { "aria-label": ariaLabel ?? label } }}
      />
      {label && (
        <span
          style={{
            color: textPrimary,
            fontSize: "14px",
            marginLeft: css.layout.space.xs,
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
