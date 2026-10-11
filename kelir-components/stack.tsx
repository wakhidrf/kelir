import MuiBox from "@mui/material/Box";
import type { StackProps } from "../kelir-types";
import { css } from "../kelir-variants";

const gaps = {
  xs: css.layout.space.xs,
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
} as const;

// Primitif layout sealed (P1b STYLE.md): susunan + jarak + perataan dari
// token css.layout. `align`/`justify` union tertutup nilai logis
// (RTL-benar); default stretch/start = perilaku lama (nol-ubah visual).
// Tanpa warna/border/shadow/font. Basis MUI (MuiBox = div + emotion +
// tema di tree) untuk multi-platform; visual milik kit. Tanpa
// ...rest ke DOM dan tanpa style passthrough — di luar kontrak = pelanggaran.
export function Stack({
  children,
  gap = "md",
  direction = "column",
  align = "stretch",
  justify = "start",
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
        alignItems: align,
        justifyContent: justify,
      }}
    >
      {children}
    </MuiBox>
  );
}
