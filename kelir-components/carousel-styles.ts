import type * as React from "react";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

// Carousel visuals (internal): nav button frame + dot states.
export const carouselNavButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  border: `1px solid ${css.border.light}`,
  borderRadius: "999px",
  backgroundColor: neumorphicBg,
  color: textPrimary,
  boxShadow: convexShadow,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "18px",
  transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
};

export function carouselDotStyle(active: boolean): React.CSSProperties {
  return {
    width: active ? "20px" : "8px",
    height: "8px",
    padding: 0,
    border: "none",
    borderRadius: "999px",
    backgroundColor: active ? css.colors.primary : css.track,
    boxShadow: active ? convexShadow : "none",
    cursor: "pointer",
    transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
  };
}