import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionProps } from "../kelir-types";
import { css } from "../kelir-variants";

const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Accordion({ summary, details, ...props }: AccordionProps) {
  return (
    <MuiAccordion
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: css.shadows.card,
        border: `1px solid ${css.border.light}`,
        marginBottom: css.layout.space.sm,
        fontFamily: "inherit",
        ...props.style,
      }}
      disableGutters
      sx={{
        "&::before": { display: "none" },
        ...props.sx,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ color: textPrimary }} />}
      >
        <div style={{ fontWeight: 600, color: textPrimary }}>{summary}</div>
      </AccordionSummary>
      <AccordionDetails
        style={{
          borderTop: `1px solid ${css.divider}`,
          color: textSecondary,
        }}
      >
        {details}
      </AccordionDetails>
    </MuiAccordion>
  );
}
