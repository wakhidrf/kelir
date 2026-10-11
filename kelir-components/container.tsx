import MuiBox from "@mui/material/Box";
import type { ContainerProps } from "../kelir-types";
import { css } from "../kelir-variants";

const maxWidths = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: css.layout.container.maxWidth,
} as const;

const paddings = {
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
  xl: css.layout.container.sidePadding,
  "2xl": css.layout.space["2xl"],
} as const;

// Penampung lebar halaman sealed (P1b STYLE.md): maxWidth + margin auto +
// gutter dari token css.layout. Murni layout — tanpa warna/border/shadow.
// Basis MUI (MuiBox) agar di tree tema; visual milik kit. Tanpa ...rest ke
// DOM dan tanpa style passthrough — di luar kontrak = pelanggaran.
export function Container({
  children,
  maxWidth = "xl",
  padding = "xl",
  id,
  "aria-label": ariaLabel,
}: ContainerProps) {
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        width: "100%",
        maxWidth: maxWidths[maxWidth],
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: paddings[padding],
        paddingRight: paddings[padding],
      }}
    >
      {children}
    </MuiBox>
  );
}
