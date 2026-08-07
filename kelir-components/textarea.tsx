import * as React from "react";
import type { TextareaProps } from "../kelir-types";
import { css } from "../kelir-variants";

const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Textarea({
  label,
  error,
  helperText,
  style,
  onFocus,
  onBlur,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <div
          style={{
            marginBottom: "6px",
            fontSize: "14px",
            fontWeight: 600,
            color: textPrimary,
            fontFamily: "inherit",
          }}
        >
          {label}
        </div>
      )}
      <textarea
        {...props}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: neumorphicBg,
          borderRadius: css.radius.sm,
          border: `1px solid ${
            error
              ? css.destructive
              : focused
                ? css.colors.primary
                : css.border.light
          }`,
          boxShadow: concaveShadow,
          padding: "10px 14px",
          color: textPrimary,
          fontFamily: "inherit",
          fontSize: "14px",
          outline: "none",
          resize: "vertical",
          transition: `border ${css.motion.duration.hover} ${css.motion.easing.curve}`,
          ...style,
        }}
      />
      {helperText && (
        <div
          style={{
            marginTop: css.layout.space.xs,
            fontSize: "12px",
            color: error ? css.destructive : textSecondary,
            fontFamily: "inherit",
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
