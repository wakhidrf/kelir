import FormControlLabel from "@mui/material/FormControlLabel";
import MuiRadio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import type { RadioGroupProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Pilihan tunggal sealed (Gel.2 STYLE.md §6): basis MUI; `onChange` semantik
// (string); opsi label/value milik kit. Tanpa ...rest, tanpa style konsumen.
export function RadioGroup({
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
  id,
  "aria-label": ariaLabel,
}: RadioGroupProps) {
  return (
    <MuiRadioGroup
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      id={id}
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: css.layout.space.sm,
        fontFamily: "inherit",
      }}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          disabled={disabled}
          control={
            <MuiRadio
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
          }
          label={
            <span
              style={{
                color: textPrimary,
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            >
              {option.label}
            </span>
          }
          style={{ marginRight: 0 }}
        />
      ))}
    </MuiRadioGroup>
  );
}
