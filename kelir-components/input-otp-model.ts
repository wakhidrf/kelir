"use client";

import * as React from "react";
import type { InputOtpProps } from "../kelir-kit/kit-forms-input";

// InputOtp edit behavior (internal): per-slot refs, focus movement, digit
// typing, backspace, arrow keys, and paste. Rendering lives in input-otp.tsx.
export function useInputOtp({ value, onChange, length = 4 }: InputOtpProps) {
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

  return {
    inputRefs,
    focusedIndex,
    setFocusedIndex,
    slots,
    handleChange,
    handleKeyDown,
    handlePaste,
  };
}