import MuiDivider from "@mui/material/Divider";
import type { SeparatorProps } from "../kelir-kit/kit-data-display-data";
import { css } from "../kelir-kit/kit-create-css";

const textSecondary = css.colors.textSecondary;

// Sealed separator (P1c STYLE.md §6): MUI base for multi-platform; only
// contract props — no ...rest to the DOM, no consumer style/sx/className/variant
// Line + label typography owned by the kit.
export function Separator({
  label,
  orientation = "horizontal",
  id,
  "aria-label": ariaLabel,
}: SeparatorProps) {
  return (
    <MuiDivider
      orientation={orientation}
      id={id}
      aria-label={ariaLabel}
      style={{
        borderColor: css.divider,
        margin: `${css.layout.space.md} 0`,
        fontFamily: "inherit",
        color: textSecondary,
        fontSize: "12px",
      }}
    >
      {label}
    </MuiDivider>
  );
}
