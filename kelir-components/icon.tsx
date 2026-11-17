import MuiBox from "@mui/material/Box";
import type { IconProps } from "../kelir-types";
import { css } from "../kelir-variants";

const sizes = {
  sm: "1rem",
  md: "1.25rem",
  lg: "1.75rem",
} as const;

const intents = {
  inherit: "currentColor",
  primary: css.colors.textPrimary,
  secondary: css.colors.textSecondary,
  accent: css.colors.primary,
} as const;

// Sealed icon wrapper (P1c STYLE.md 6): color + size belong to the kit, consumers
// only supply the icon element. `intent` is a closed union from color tokens;
// `size` is a closed union (MUI SVG is forced to use `fontSize: inherit` so the
// kit scale wins). An icon without `aria-label` is treated as decorative
// (`aria-hidden`) so it does not add screen-reader noise; the accessible label
// stays with the parent button/link. No ...rest to DOM and no
// style/sx/className passthrough - outside the contract = violation.
export function Icon({
  children,
  intent = "inherit",
  size = "md",
  id,
  "aria-label": ariaLabel,
}: IconProps) {
  return (
    <MuiBox
      component="span"
      id={id}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      sx={{ "& .MuiSvgIcon-root": { fontSize: "inherit" } }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: intents[intent],
        fontSize: sizes[size],
        lineHeight: 1,
      }}
    >
      {children}
    </MuiBox>
  );
}
