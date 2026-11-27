import MuiInputBase from "@mui/material/InputBase";
import type * as React from "react";
import type { InputProps } from "../kelir-kit/kit-forms-input";
 import type { KitSize } from "../kelir-kit/kit-size";
import { css } from "../kelir-kit/kit-create-css";

const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

// INTERNAL kit (not public contract): text field styles belong to the kit. Used
// by Input + internal composites (Combobox, Select, NativeSelect) so there is no
// visual duplication. Consumers do not import this - visuals only through sealed
// components.
// Single source of size→metrics: every text-like control derives block/inline
// padding + font size from the same kit tokens, so controls of the same size
// have identical height and typography (issue #139).
export function getControlMetrics(size: KitSize) {
  const small = size === "xs" || size === "sm";
  return {
    small,
    paddingBlock: small ? css.layout.space.xs : css.layout.space.sm,
    paddingInline: small ? css.layout.space.md : css.layout.space.lg,
    fontSize: small ? "13px" : "14px",
  };
}

// Shared control surface (background/radius/shadow/border/blur/type) without
// padding: Input pads its root, Select/NativeSelect pad the inner select box so
// the dropdown icon gutter fits.
export function getControlSurfaceStyle(size: KitSize): React.CSSProperties {
  return {
    backgroundColor: neumorphicBg,
    borderRadius: css.control.radius,
    boxShadow: concaveShadow,
    border: `1px solid ${css.border.light}`,
    backdropFilter: surfaceBlur,
    WebkitBackdropFilter: surfaceBlur,
    color: textPrimary,
    fontFamily: "inherit",
    fontSize: getControlMetrics(size).fontSize,
    transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
  };
}

export function getInputStyle(size: KitSize): React.CSSProperties {
  const { paddingBlock, paddingInline } = getControlMetrics(size);
  return {
    ...getControlSurfaceStyle(size),
    padding: `${paddingBlock} ${paddingInline}`,
  };
}

// Root sx shared by Input + Combobox. The kit pads the ROOT (getInputStyle), so
// MUI's default inner-input padding (4px 0 5px) must be zeroed: otherwise the
// control is padded twice and renders taller than Select of the same size (#144).
export const inputRootSx = {
  "& .MuiInputBase-input": {
    padding: 0,
  },
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
      sx={inputRootSx}
    />
  );
}
