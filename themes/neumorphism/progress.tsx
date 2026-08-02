import * as React from "react";
import { ProgressProps } from "../../types.js";
import MuiLinearProgress from "@mui/material/LinearProgress";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Progress({ style, ...props }: ProgressProps) {
  return (
    <MuiLinearProgress
      {...props}
      style={{
        borderRadius: "999px",
        height: "10px",
        backgroundColor: "rgba(0,0,0,0.05)",
        boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.1)",
        ...style,
      }}
      sx={{
        "& .MuiLinearProgress-bar": {
          backgroundColor: "var(--color-primary, #C8E0F4)",
          borderRadius: "999px",
        }
      }}
    />
  );
}
