"use client";

import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { TextareaProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Typography } from "./typography";

export function Textarea({
  label,
  error,
  helperText,
  value,
  defaultValue,
  onChange,
  placeholder,
  rows,
  disabled,
  id,
  "aria-label": ariaLabel,
}: TextareaProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <MuiBox sx={{ width: "100%" }}>
      {label && <Typography variant="label-caps">{label}</Typography>}
      <textarea
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        id={id}
        aria-label={ariaLabel ?? label}
        aria-invalid={error || undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: css.colors.surface,
          borderRadius: css.radius.sm,
          border: `1px solid ${
            error
              ? css.destructive
              : focused
                ? css.colors.primary
                : css.border.light
          }`,
          boxShadow: css.shadows.concave,
          backdropFilter: css.motion.blur.backdrop,
          WebkitBackdropFilter: css.motion.blur.backdrop,
          padding: "10px 14px",
          color: css.colors.textPrimary,
          fontFamily: "inherit",
          fontSize: "14px",
          outline: focused
            ? `${css.focusRing.width} solid ${css.focusRing.color}`
            : "none",
          outlineOffset: css.focusRing.offset,
          resize: "vertical",
          transition: `border ${css.motion.duration.hover} ${css.motion.easing.curve}`,
        }}
      />
      {helperText && (
        <MuiBox
          sx={{
            marginTop: css.layout.space.xs,
            fontSize: "12px",
            color: error ? css.destructive : css.colors.textSecondary,
            fontFamily: "inherit",
          }}
        >
          {helperText}
        </MuiBox>
      )}
    </MuiBox>
  );
}
