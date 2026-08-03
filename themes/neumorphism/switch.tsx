import * as React from "react";
import { SwitchProps } from "../../types";
import MuiSwitch from "@mui/material/Switch";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Switch({ label, style, ...props }: SwitchProps) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", fontFamily: "inherit" }}>
      <MuiSwitch {...props} style={style} />
      {label && <span style={{ color: textPrimary, fontSize: "14px", marginLeft: "4px" }}>{label}</span>}
    </label>
  );
}
