import type * as React from "react";
import { css } from "../kelir-variants";
import {
  convexShadow,
  neumorphicBg,
  textPrimary,
} from "./date-picker-constants";

export function getModeButtonStyle(): React.CSSProperties {
  return {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: css.radius.button,
    color: textPrimary,
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: 700,
    padding: "4px 8px",
    cursor: "pointer",
  };
}

export function getOptionButtonStyle(
  isSelected: boolean,
): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "8px 4px",
    borderRadius: css.radius.button,
    border: "1px solid transparent",
    backgroundColor: isSelected ? css.colors.primary : "transparent",
    color: isSelected ? css.on.primary : textPrimary,
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: isSelected ? 700 : 400,
    cursor: "pointer",
  };
}

export function getNavButtonStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    borderRadius: css.radius.button,
    backgroundColor: neumorphicBg,
    border: `1px solid ${css.border.light}`,
    boxShadow: convexShadow,
    color: textPrimary,
    fontFamily: "inherit",
    fontSize: "16px",
    lineHeight: 1,
    cursor: "pointer",
  };
}

export function getDayButtonStyle(
  day: number,
  value: Date | null,
  year: number,
  month: number,
  today: Date,
): React.CSSProperties {
  const selected =
    value &&
    value.getFullYear() === year &&
    value.getMonth() === month &&
    value.getDate() === day;
  const isToday =
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    margin: "0 auto",
    borderRadius: css.radius.button,
    border: `1px solid ${isToday && !selected ? css.border.medium : "transparent"}`,
    backgroundColor: selected ? css.colors.primary : "transparent",
    color: selected ? css.on.primary : textPrimary,
    fontFamily: "inherit",
    fontSize: "14px",
    cursor: "pointer",
    transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
  };
}