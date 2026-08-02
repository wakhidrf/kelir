import * as React from "react";
import { InputProps } from "../../types.js";
import MuiInputBase from "@mui/material/InputBase";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Input({ style, ...props }: InputProps) {
  return (
    <MuiInputBase
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: "14px",
        boxShadow: concaveShadow,
        border: "1px solid rgba(255, 255, 255, 0.4)",
        padding: "8px 16px",
        color: textPrimary,
        fontFamily: "inherit",
        fontSize: "14px",
        transition: "all 150ms ease-out",
        ...style,
      }}
    />
  );
}
