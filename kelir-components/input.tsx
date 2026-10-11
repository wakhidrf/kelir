import MuiInputBase from "@mui/material/InputBase";
import type * as React from "react";
import type { InputProps } from "../kelir-types";
import { css } from "../kelir-variants";

const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

// INTERNAL kit (bukan kontrak publik): gaya field teks milik kit. Dipakai
// Input + komposit internal (Combobox) agar tidak ada duplikasi visual.
// Konsumen tidak mengimpor ini — visual hanya lewat komponen sealed.
export function getInputStyle(size: "small" | "medium"): React.CSSProperties {
  return {
    backgroundColor: neumorphicBg,
    borderRadius: css.control.radius,
    boxShadow: concaveShadow,
    border: `1px solid ${css.border.light}`,
    backdropFilter: surfaceBlur,
    WebkitBackdropFilter: surfaceBlur,
    padding:
      size === "small"
        ? `${css.layout.space.xs} ${css.layout.space.md}`
        : `${css.layout.space.sm} ${css.layout.space.lg}`,
    color: textPrimary,
    fontFamily: "inherit",
    fontSize: size === "small" ? "13px" : "14px",
    transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
  };
}

export const inputFocusSx = {
  "&.Mui-focused": {
    borderColor: css.colors.primary,
  },
  "&:focus-visible": {
    outline: `${css.focusRing.width} solid ${css.focusRing.color}`,
    outlineOffset: css.focusRing.offset,
  },
};

// Field teks sealed (P1c STYLE.md §6): basis MUI (MuiInputBase) untuk
// multi-platform; hanya props kontrak yang diteruskan — tanpa ...rest ke DOM,
// tanpa style/sx/className konsumen. `onChange` semantik (menerima string,
// bukan event) — adaptasi event→nilai milik kit, bukan konsumen.
export function Input({
  value,
  defaultValue,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  size = "medium",
  id,
  "aria-label": ariaLabel,
}: InputProps) {
  return (
    <MuiInputBase
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      style={getInputStyle(size)}
      sx={inputFocusSx}
    />
  );
}
