import * as React from "react";
import { ToggleGroupProps } from "../../types";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function ToggleGroup({ style, ...props }: ToggleGroupProps) {
  return (
    <div
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: "14px",
        boxShadow: convexShadow,
        border: "1px solid rgba(255, 255, 255, 0.4)",
        padding: "16px",
        color: textPrimary,
        fontFamily: "inherit",
        ...style,
      }}
      {...(props as any)}
    >
      <div style={{ fontWeight: 600, marginBottom: "8px" }}>ToggleGroup Component</div>
      <div style={{ fontSize: "14px", color: textSecondary }}>
        {props.children || "Neumorphic design system component."}
      </div>
    </div>
  );
}
