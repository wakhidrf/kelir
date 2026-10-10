import MuiBox from "@mui/material/Box";
import type { StackProps } from "../kelir-types";
import { css } from "../kelir-variants";

const gaps = {
  xs: css.layout.space.xs,
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
} as const;

// Primitif layout sealed (P1b STYLE.md): hanya susunan + jarak dari token
// css.layout. Tanpa warna/border/shadow/font. Basis MUI (MuiBox = div +
// emotion + tema di tree) untuk multi-platform; visual milik kit. Tanpa
// ...rest ke DOM dan tanpa style passthrough — di luar kontrak = pelanggaran.
export function Stack({
  children,
  gap = "md",
  direction = "column",
  id,
  "aria-label": ariaLabel,
}: StackProps) {
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexDirection: direction,
        gap: gaps[gap],
      }}
    >
      {children}
    </MuiBox>
  );
}
