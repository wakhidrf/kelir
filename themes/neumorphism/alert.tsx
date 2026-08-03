import * as React from "react";
import { AlertProps } from "../../types";
import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Alert({ title, children, style, ...props }: AlertProps) {
  return (
    <MuiAlert
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: "14px",
        boxShadow: cardShadow,
        border: "1px solid rgba(255, 255, 255, 0.4)",
        color: textPrimary,
        fontFamily: "inherit",
        ...style,
      }}
    >
      {title && <AlertTitle style={{ fontWeight: 700, color: textPrimary }}>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
}
