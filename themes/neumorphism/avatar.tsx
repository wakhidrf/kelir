import * as React from "react";
import { AvatarProps } from "../../types.js";
import MuiAvatar from "@mui/material/Avatar";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Avatar({ fallbackText, style, ...props }: AvatarProps) {
  return (
    <MuiAvatar
      {...props}
      style={{
        boxShadow: convexShadow,
        border: "2px solid rgba(255, 255, 255, 0.6)",
        backgroundColor: "var(--color-primary, #C8E0F4)",
        color: "#2c4a63",
        fontWeight: 600,
        ...style,
      }}
    >
      {fallbackText || props.children}
    </MuiAvatar>
  );
}
