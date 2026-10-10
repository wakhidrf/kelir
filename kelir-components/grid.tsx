import MuiBox from "@mui/material/Box";
import type { GridProps } from "../kelir-types";
import { css } from "../kelir-variants";

const gaps = {
  xs: css.layout.space.xs,
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
} as const;

// Primitif layout sealed (P1b STYLE.md): kolom union tertutup (bukan angka
// bebas) + jarak dari token css.layout. Basis MUI (MuiBox) untuk
// multi-platform; tanpa visual, tanpa ...rest ke DOM, tanpa style passthrough.
export function Grid({
  children,
  columns = 2,
  gap = "md",
  id,
  "aria-label": ariaLabel,
}: GridProps) {
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: gaps[gap],
      }}
    >
      {children}
    </MuiBox>
  );
}
