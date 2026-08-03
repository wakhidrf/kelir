import * as React from "react";
import { ButtonProps } from "../../types";
import MuiButton from "@mui/material/Button";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Button({ variant = "primary", style, ...props }: ButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isDestructive = variant === "destructive";
  const isGhost = variant === "ghost";

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      backgroundColor: neumorphicBg,
      borderRadius: "14px",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      boxShadow: convexShadow,
      textTransform: "none",
      fontWeight: 600,
      color: textPrimary,
      padding: "10px 20px",
      transition: "all 150ms ease-out",
      fontFamily: "inherit",
      ...style,
    };

    if (isPrimary) {
      base.backgroundColor = "var(--color-primary, #C8E0F4)";
      base.color = "#2c4a63";
    } else if (isDestructive) {
      base.backgroundColor = "#ffccd5";
      base.color = "#900c3f";
    } else if (isGhost) {
      base.boxShadow = "none";
      base.border = "none";
    }
    return base;
  };

  return (
    <MuiButton
      {...props}
      style={getStyles()}
      sx={{
        "&:active": {
          boxShadow: concaveShadow,
          transform: "translateY(1px)",
        },
        "&:hover": {
          backgroundColor: isPrimary ? "var(--color-primary, #C8E0F4)" : undefined,
          opacity: 0.9,
        },
      }}
    />
  );
}
