import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionProps } from "../kelir-kit/kit-actions";
import { css } from "../kelir-kit/kit-create-css";

// Accordion sealed (Gel.3c-6 STYLE.md §6): summary/details TEXT slot,
// expanded CONTROLLED + semantic onChange; visuals owned by the kit.
export function Accordion({
  summary,
  details,
  expanded,
  defaultExpanded,
  onChange,
  disabled,
}: AccordionProps) {
  return (
    <MuiAccordion
      expanded={expanded}
      defaultExpanded={defaultExpanded}
      // Semantic adapter: MUI passes (event, expanded); kit contract is boolean only.
      onChange={onChange ? (_e, next) => onChange(next) : undefined}
      disabled={disabled}
      disableGutters
      sx={{
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.card,
        boxShadow: css.shadows.card,
        border: `1px solid ${css.border.light}`,
        marginBottom: css.layout.space.sm,
        fontFamily: "inherit",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ color: css.colors.textPrimary }} />}
      >
        <div style={{ fontWeight: 600, color: css.colors.textPrimary }}>
          {summary}
        </div>
      </AccordionSummary>
      <AccordionDetails
        style={{
          borderTop: `1px solid ${css.divider}`,
          color: css.colors.textSecondary,
        }}
      >
        {details}
      </AccordionDetails>
    </MuiAccordion>
  );
}
