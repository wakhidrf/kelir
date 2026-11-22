import type * as React from "react";
import { css } from "../kelir-kit/kit-create-css";

const convexShadow = css.shadows.convex;
const textPrimary = css.colors.textPrimary;

export function getBubbleStyle(
  isSent: boolean,
  collapsible: boolean,
): React.CSSProperties {
  return {
    maxWidth: "80%",
    padding: "10px 14px",
    borderRadius: css.radius.prominent,
    fontSize: "14px",
    lineHeight: 1.5,
    fontFamily: "inherit",
    wordBreak: "break-word",
    boxShadow: convexShadow,
    textAlign: "left",
    appearance: "none",
    cursor: collapsible ? "pointer" : "default",
    transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
    ...(isSent
      ? {
          backgroundColor: css.colors.primary,
          color: css.on.primary,
          borderBottomRightRadius: 6,
        }
      : {
          backgroundColor: css.colors.surface,
          color: textPrimary,
          border: `1px solid ${css.border.light}`,
          borderBottomLeftRadius: 6,
        }),
  };
}