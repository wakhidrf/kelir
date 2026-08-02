import * as React from "react";
import { AccordionProps } from "../../types.js";
import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const cardShadow = "var(--shadow-card, 3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8))";
const convexShadow = "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))";
const concaveShadow = "var(--shadow-concave, inset 5px 5px 10px rgba(0, 0, 0, 0.08), inset -5px -5px 10px rgba(255, 255, 255, 0.9))";
const neumorphicBg = "var(--color-background, #E8E8E8)";
const textPrimary = "var(--color-text-primary, #333333)";
const textSecondary = "var(--color-text-secondary, #666666)";


export function Accordion({ summary, details, style, ...props }: AccordionProps) {
  return (
    <MuiAccordion
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: "14px",
        boxShadow: convexShadow,
        border: "1px solid rgba(255, 255, 255, 0.4)",
        marginBottom: "8px",
        fontFamily: "inherit",
        ...style,
      }}
      disableGutters
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: textPrimary }} />}>
        <div style={{ fontWeight: 600, color: textPrimary }}>{summary}</div>
      </AccordionSummary>
      <AccordionDetails style={{ borderTop: "1px solid rgba(0,0,0,0.05)", color: textSecondary }}>
        {details}
      </AccordionDetails>
    </MuiAccordion>
  );
}
