import MuiBox from "@mui/material/Box";
import type { GridProps } from "../kelir-types";
import { css } from "../kelir-variants";

const gaps = {
  xs: css.layout.space.xs,
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
  xl: css.layout.space.xl,
  "2xl": css.layout.space["2xl"],
  "3xl": css.layout.space["3xl"],
  "4xl": css.layout.space["4xl"],
} as const;

// Kit responsive thresholds (single source: layout tokens) - `mobile` 600px for
// `columnsSm`, `heroCollapse` 768px for `columnsMd`. The md rule is written
// after sm so it wins when both match.
const SM_QUERY = `@media (min-width: ${css.layout.breakpoints.mobile})`;
const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

const columnsCss = (n: number) => `repeat(${n}, minmax(0, 1fr))`;

// Aside panel: fixed width from the kit scale + collapse threshold (900px =
// internal Sidebar threshold so aside & shell collapse together).
const asideWidths = { sm: 240, md: 280, lg: 320 } as const;
const collapsePx = { md: css.layout.breakpoints.heroCollapse, lg: "900px" } as const;
const PIN_HEIGHT = 680;
const PIN_MAX = "calc(100dvh - 48px)";

// Auto-fit: column count follows container width with minimum item width
// from tokens (no media query - inline is enough).
const autoFitCss = (minItem: "sm" | "md") =>
  `repeat(auto-fit, minmax(${css.layout.gridMin[minItem]}, 1fr))`;

// Sealed layout primitive (P1b STYLE.md): closed-union columns (not arbitrary
// numbers) + spacing from css.layout tokens. `minItem` = auto-fit minimum item
// width from tokens (replaces columns*). `columnsSm`/`columnsMd` = column count
// at width >= 600px / >= 768px; when used, the base columns also move to
// `sx` (emotion) so the media query can win - still server-safe without hooks.
// MUI basis (MuiBox) for multi-platform; no visuals, no ...rest to DOM,
// no style passthrough.
export function Grid({
  children,
  columns = 2,
  columnsSm,
  columnsMd,
  minItem,
  gap = "md",
  template = "auto",
  asideWidth = "md",
  collapse = "lg",
  pinned = false,
  id,
  "aria-label": ariaLabel,
}: GridProps) {
  if (template === "aside") {
    const bp = collapsePx[collapse];
    return (
      <MuiBox
        id={id}
        aria-label={ariaLabel}
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: gaps[gap],
          alignItems: "start",
          [`@media (min-width: ${bp})`]: {
            gridTemplateColumns: `${asideWidths[asideWidth]}px minmax(0, 1fr)`,
            ...(pinned
              ? {
                  height: PIN_HEIGHT,
                  maxHeight: PIN_MAX,
                  alignItems: "stretch",
                }
              : {}),
          },
          "& > *": { minWidth: 0, minHeight: 0 },
        }}
      >
        {children}
      </MuiBox>
    );
  }
  const responsive = columnsSm !== undefined || columnsMd !== undefined;
  const autoFit = minItem !== undefined;
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={
        responsive && !autoFit
          ? {
              gridTemplateColumns: columnsCss(columnsSm ?? columns),
              [MD_QUERY]: {
                gridTemplateColumns: columnsCss(
                  columnsMd ?? columnsSm ?? columns,
                ),
              },
            }
          : undefined
      }
      style={{
        display: "grid",
        ...(autoFit
          ? { gridTemplateColumns: autoFitCss(minItem) }
          : responsive
            ? null
            : { gridTemplateColumns: columnsCss(columns) }),
        gap: gaps[gap],
      }}
    >
      {children}
    </MuiBox>
  );
}
