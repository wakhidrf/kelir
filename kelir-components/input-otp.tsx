"use client";

import MuiBox from "@mui/material/Box";
import type { InputOtpProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { useInputOtp } from "./input-otp-model";

export function InputOtp({
  value,
  onChange,
  length = 4,
  id,
  "aria-label": ariaLabel,
}: InputOtpProps) {
  const {
    inputRefs,
    focusedIndex,
    setFocusedIndex,
    slots,
    handleChange,
    handleKeyDown,
    handlePaste,
  } = useInputOtp({ value, onChange, length });

  return (
    <MuiBox
      role="group"
      id={id}
      aria-label={ariaLabel ?? "Verification code"}
      sx={{
        display: "flex",
        gap: css.layout.space.sm,
        fontFamily: "inherit",
      }}
    >
      {slots.map((slot) => (
        <input
          key={`otp-${slot}`}
          ref={(el) => {
            inputRefs.current[slot] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[slot] ?? ""}
          aria-label={`OTP digit ${slot + 1}`}
          onFocus={() => setFocusedIndex(slot)}
          onBlur={() => setFocusedIndex(null)}
          onChange={(e) => handleChange(slot, e)}
          onKeyDown={(e) => handleKeyDown(slot, e)}
          onPaste={(e) => handlePaste(slot, e)}
          style={{
            width: "48px",
            height: "52px",
            textAlign: "center",
            boxSizing: "border-box",
            backgroundColor: css.colors.surface,
            borderRadius: css.control.radius,
            border: `1px solid ${
              focusedIndex === slot ? css.colors.primary : css.border.light
            }`,
            boxShadow: css.shadows.concave,
            color: css.colors.textPrimary,
            fontFamily: "inherit",
            fontSize: "18px",
            fontWeight: 600,
            outline: "none",
            transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
          }}
        />
      ))}
    </MuiBox>
  );
}