import MuiSwitch from "@mui/material/Switch";
import type { SwitchProps } from "../kelir-kit/kit-forms-choice";
import { css } from "../kelir-kit/kit-create-css";

const textPrimary = css.colors.textPrimary;

// Sealed switch (Gel.2 STYLE.md §6): MUI base; `onChange` semantics
// (boolean); text slot label owned by the kit. No ...rest, no consumer style.
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
        // MUI v9: input attributes go through slotProps.input (inputProps is deprecated).
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
