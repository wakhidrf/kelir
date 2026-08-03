import * as React from "react";
import { TypographyProps } from "../../types";
import MuiTypography from "@mui/material/Typography";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Typography({ variant = "body-md", style, ...props }: TypographyProps) {
  const getMappedVariant = () => {
    if (variant === "h1") return "h3";
    if (variant === "h2") return "h4";
    return "body1";
  };

  const getStyleOverrides = (): React.CSSProperties => {
    if (variant === "h1") {
      return { fontWeight: 700, color: textPrimary };
    }
    if (variant === "label-caps") {
      return { fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: textSecondary };
    }
    return { color: textPrimary };
  };

  return (
    <MuiTypography
      {...props}
      variant={getMappedVariant() as any}
      style={{
        fontFamily: "inherit",
        ...getStyleOverrides(),
        ...style,
      }}
    />
  );
}
