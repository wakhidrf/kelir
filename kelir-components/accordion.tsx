import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Accordion sealed (Gel.3c-6 STYLE.md §6): summary/details slot TEKS,
// expanded TERKONTROL + onChange semantik; visual milik kit.
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
      // Adaptor semantik: MUI kirim (event, expanded); kontrak kit boolean saja.
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
