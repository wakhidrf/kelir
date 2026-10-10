import MuiSlider from "@mui/material/Slider";
import type { SliderProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Slider({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step,
  disabled,
  id,
  "aria-label": ariaLabel,
}: SliderProps) {
  return (
    <MuiSlider
      value={value}
      defaultValue={defaultValue}
      onChange={(_e, next) => {
        // Kontrak nilai tunggal: range MUI (number[]) di luar kontrak —
        // ambil batas pertama agar onChange(number) total.
        onChange?.(Array.isArray(next) ? (next[0] ?? 0) : next);
      }}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      sx={{
        color: css.colors.primary,
        "& .MuiSlider-thumb": {
          backgroundColor: css.colors.surface,
          boxShadow: css.shadows.convex,
          border: `2px solid ${css.colors.primary}`,
        },
        "& .MuiSlider-rail": {
          backgroundColor: css.track,
        },
      }}
    />
  );
}
