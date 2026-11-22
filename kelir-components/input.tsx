import MuiInputBase from "@mui/material/InputBase";
import type * as React from "react";
import type { InputProps, KitSize } from "../kelir-types";
import { css } from "../kelir-variants";

const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

// INTERNAL kit (not public contract): text field styles belong to the kit. Used
// by Input + internal composites (Combobox) so there is no visual duplication.
// Consumers do not import this - visuals only through sealed components.
export function getInputStyle(size: KitSize): React.CSSProperties {
  const small = size === "xs" || size === "sm";
  return {
    backgroundColor: neumorphicBg,
    borderRadius: css.control.radius,
    boxShadow: concaveShadow,
    border: `1px solid ${css.border.light}`,
    backdropFilter: surfaceBlur,
    WebkitBackdropFilter: surfaceBlur,
    padding: small
      ? `${css.layout.space.xs} ${css.layout.space.md}`
      : `${css.layout.space.sm} ${css.layout.space.lg}`,
    color: textPrimary,
    fontFamily: "inherit",
    fontSize: small ? "13px" : "14px",
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

// Sealed text field (P1c STYLE.md §6): MUI basis (MuiInputBase) for
// multi-platform; only contract props are forwarded - no ...rest to DOM,
// no consumer style/sx/className. `onChange` is semantic (receives a string,
// not an event) - the event→value adaptation belongs to the kit, not the consumer.
export function Input({
  value,
  defaultValue,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  size = "md",
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
