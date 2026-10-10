"use client";

import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { InputOtpProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function InputOtp({
  value,
  onChange,
  length = 4,
  id,
  "aria-label": ariaLabel,
}: InputOtpProps) {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  const slots = Array.from({ length }, (_, index) => index);

  const focusBox = (index: number) => {
    const el = inputRefs.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const typed = e.target.value.slice(-1);
    const chars = value.split("");
    chars[index] = typed;
    onChange(chars.join(""));
    if (typed && index < length - 1) {
      focusBox(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!value[index]) {
        e.preventDefault();
        if (index > 0) {
          const chars = value.split("");
          chars[index - 1] = "";
          onChange(chars.join(""));
          focusBox(index - 1);
        }
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(Math.max(0, index - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(Math.min(length - 1, index + 1));
    }
  };

  const handlePaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length - index);
    if (!text) {
      return;
    }
    const chars = value.split("");
    for (let i = 0; i < text.length; i++) {
      chars[index + i] = text[i];
    }
    onChange(chars.join(""));
    focusBox(Math.min(index + text.length, length - 1));
  };

  return (
    <MuiBox
      role="group"
      id={id}
      aria-label={ariaLabel ?? "Kode verifikasi"}
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
            borderRadius: css.radius.sm,
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
