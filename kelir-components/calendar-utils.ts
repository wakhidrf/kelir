import type * as React from "react";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const navButtonStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30px",
  height: "30px",
  border: `1px solid ${css.border.light}`,
  borderRadius: css.radius.button,
  backgroundColor: neumorphicBg,
  color: textPrimary,
  boxShadow: convexShadow,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "16px",
  transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
};

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}