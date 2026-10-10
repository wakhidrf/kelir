import MuiDivider from "@mui/material/Divider";
import type { SeparatorProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textSecondary = css.colors.textSecondary;

// Pemisah sealed (P1c STYLE.md §6): basis MUI untuk multi-platform; hanya
// props kontrak — tanpa ...rest ke DOM, tanpa style/sx/className/variant
// konsumen. Garis + tipografi label milik kit.
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
