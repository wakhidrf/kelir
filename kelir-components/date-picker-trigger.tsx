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
import { getControlMetrics } from "./input";

export function DatePickerTrigger({
  value,
  placeholder,
  onOpen,
}: {
  value: Date | null;
  placeholder?: string;
  onOpen: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // Same control metrics as Input of the same size (#142): the trigger is a
  // field, so its padding/type come from the kit token scale.
  const { paddingBlock, paddingInline, fontSize } = getControlMetrics("md");
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
        padding: `${paddingBlock} ${paddingInline}`,
        color: value ? textPrimary : textSecondary,
        fontFamily: "inherit",
        fontSize,
        cursor: "pointer",
        transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
      }}
    >
      {value ? formatDate(value) : placeholder || "Select date"}
    </button>
  );
}