"use client";

import * as React from "react";
import { css } from "../kelir-kit/kit-create-css";
import {
  formatDate,
  concaveShadow,
  neumorphicBg,
  textPrimary,
  textSecondary,
} from "./date-picker-constants";

export function DatePickerTrigger({
  value,
  placeholder,
  onOpen,
}: {
  value: Date | null;
  placeholder?: string;
  onOpen: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        width: "100%",
        textAlign: "left",
        backgroundColor: neumorphicBg,
        borderRadius: css.control.radius,
        boxShadow: concaveShadow,
        border: `1px solid ${css.border.light}`,
        padding: "10px 14px",
        color: value ? textPrimary : textSecondary,
        fontFamily: "inherit",
        fontSize: "14px",
        cursor: "pointer",
        transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
      }}
    >
      {value ? formatDate(value) : placeholder || "Select date"}
    </button>
  );
}