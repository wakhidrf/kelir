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

// `paddingBlock?` uses the same space scale (`none` = 0).
const paddingBlocks = {
  none: "0",
  ...paddings,
} as const;

// Kit responsive breakpoint (single source: heroCollapse token 768px).
const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

// Sealed page width container (P1b STYLE.md): maxWidth + auto margin +
// gutter from the css.layout tokens. `paddingBlockMd?` = vertical breathing
// room at widths >= 768px (heroCollapse token); absent = `paddingBlock`
// applies at all widths. Pure layout - no color/border/shadow. MUI-based
// (MuiBox) so it's in the theme tree; visuals owned by the kit. No ...rest to
// the DOM and no style passthrough - out of contract = violation.
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
