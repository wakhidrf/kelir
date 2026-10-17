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

// `paddingBlock?` memakai skala space yang sama (`none` = 0).
const paddingBlocks = {
  none: "0",
  ...paddings,
} as const;

// Ambang responsif kit (satu sumber: token heroCollapse 768px).
const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

// Penampung lebar halaman sealed (P1b STYLE.md): maxWidth + margin auto +
// gutter dari token css.layout. `paddingBlockMd?` = napas vertikal pada
// lebar >= 768px (token heroCollapse); tanpa = `paddingBlock` berlaku di
// semua lebar. Murni layout — tanpa warna/border/shadow. Basis MUI (MuiBox)
// agar di tree tema; visual milik kit. Tanpa ...rest ke DOM dan tanpa style
// passthrough — di luar kontrak = pelanggaran.
export function Container({
  children,
  maxWidth = "xl",
  padding = "xl",
  paddingBlock = "none",
  paddingBlockMd,
  clip = false,
  id,
  "aria-label": ariaLabel,
}: ContainerProps) {
  const responsiveBlock = paddingBlockMd !== undefined;
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={
        responsiveBlock
          ? {
              paddingTop: paddingBlocks[paddingBlock],
              paddingBottom: paddingBlocks[paddingBlock],
              [MD_QUERY]: {
                paddingTop: paddingBlocks[paddingBlockMd],
                paddingBottom: paddingBlocks[paddingBlockMd],
              },
            }
          : undefined
      }
      style={{
        width: "100%",
        maxWidth: maxWidths[maxWidth],
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: paddings[padding],
        paddingRight: paddings[padding],
        ...(responsiveBlock
          ? null
          : ({
              paddingTop: paddingBlocks[paddingBlock],
              paddingBottom: paddingBlocks[paddingBlock],
            } as const)),
        ...(clip ? ({ overflow: "hidden" } as const) : null),
      }}
    >
      {children}
    </MuiBox>
  );
}
