import * as React from "react";
import { CardProps } from "../../types";
import MuiCard from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Card({ title, subtitle, headerActions, footer, children, style, ...props }: CardProps) {
  return (
    <MuiCard
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: "14px",
        boxShadow: cardShadow,
        border: "1px solid rgba(255, 255, 255, 0.5)",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {(title || subtitle || headerActions) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={headerActions}
          titleTypographyProps={{ variant: "h6", style: { fontWeight: 700, color: textPrimary } }}
          subheaderTypographyProps={{ style: { color: textSecondary, fontSize: "14px" } }}
        />
      )}
      <CardContent style={{ color: textPrimary }}>{children}</CardContent>
      {footer && <CardActions style={{ borderTop: "1px solid rgba(0,0,0,0.05)", padding: "12px 16px" }}>{footer}</CardActions>}
    </MuiCard>
  );
}
