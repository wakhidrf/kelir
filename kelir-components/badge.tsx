import type * as React from "react";
import type { BadgeProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function Badge({ variant = "primary", children, style }: BadgeProps) {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 600,
      fontFamily: "inherit",
      boxShadow: convexShadow,
      border: `1px solid ${css.border.light}`,
      backgroundColor: neumorphicBg,
      color: textPrimary,
      ...style,
    };

    if (variant === "primary") {
      base.backgroundColor = css.colors.primary;
      base.color = css.on.primary;
    } else if (variant === "secondary") {
      base.backgroundColor = css.colors.secondary;
      base.color = css.on.secondary;
    } else if (variant === "destructive") {
      base.backgroundColor = css.destructive;
      base.color = css.on.destructive;
    }
    return base;
  };

  return <div style={getStyles()}>{children}</div>;
}
