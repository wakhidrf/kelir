import * as React from "react";
import { BadgeProps } from "../../types";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Badge({ variant = "primary", children, style, ...props }: BadgeProps) {
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
      border: "1px solid rgba(255, 255, 255, 0.4)",
      backgroundColor: neumorphicBg,
      color: textPrimary,
      ...style,
    };

    if (variant === "primary") {
      base.backgroundColor = "var(--color-primary, #C8E0F4)";
      base.color = "#2c4a63";
    } else if (variant === "secondary") {
      base.backgroundColor = "var(--color-secondary, #F5E0E8)";
      base.color = "#632c41";
    } else if (variant === "destructive") {
      base.backgroundColor = "#ffccd5";
      base.color = "#900c3f";
    }
    return base;
  };

  return <div style={getStyles()}>{children}</div>;
}
