import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionProps } from "../kelir-kit/kit-actions";
import { css } from "../kelir-kit/kit-create-css";

const textPrimary = css.colors.textPrimary;
const onPrimary = css.on.primary;

// Accordion sealed (Gel.3c-6 STYLE.md §6): `summary` text slot, `details`
// content slot, `active` primary treatment; visuals owned by the kit.
export function Accordion({
  summary,
  details,
  expanded,
  defaultExpanded,
  onChange,
  disabled,
  active = false,
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
        expandIcon={
          <ExpandMoreIcon style={{ color: active ? onPrimary : textPrimary }} />
        }
        aria-current={active ? "true" : undefined}
        sx={{
          backgroundColor: active ? css.colors.primary : "transparent",
          color: active ? onPrimary : textPrimary,
          boxShadow: active ? css.shadows.concave : "none",
          transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
        }}
      >
        <div style={{ fontWeight: 600, color: "inherit" }}>{summary}</div>
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
