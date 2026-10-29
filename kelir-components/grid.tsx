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

// Ambang responsif kit (satu sumber: token layout) - `mobile` 600px untuk
// `columnsSm`, `heroCollapse` 768px untuk `columnsMd`. Aturan md ditulis
// setelah sm supaya ia menang saat keduanya cocok.
const SM_QUERY = `@media (min-width: ${css.layout.breakpoints.mobile})`;
const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

const columnsCss = (n: number) => `repeat(${n}, minmax(0, 1fr))`;

// Panel aside: lebar tetap dari tangga kit + ambang collapse (900px = ambang
// Sidebar internal agar aside & shell runtuh serempak).
const asideWidths = { sm: 240, md: 280, lg: 320 } as const;
const collapsePx = { md: css.layout.breakpoints.heroCollapse, lg: "900px" } as const;
const PIN_HEIGHT = 680;
const PIN_MAX = "calc(100dvh - 48px)";

// Auto-fit: jumlah kolom mengikuti lebar wadah dengan lebar item minimum
// dari token (tanpa media query - cukup inline).
const autoFitCss = (minItem: "sm" | "md") =>
  `repeat(auto-fit, minmax(${css.layout.gridMin[minItem]}, 1fr))`;

// Primitif layout sealed (P1b STYLE.md): kolom union tertutup (bukan angka
// bebas) + jarak dari token css.layout. `minItem` = auto-fit lebar minimum
// item dari token (menggantikan columns*). `columnsSm`/`columnsMd` = jumlah kolom
// pada lebar >= 600px / >= 768px; saat dipakai, kolom dasar ikut pindah ke
// `sx` (emotion) agar media query bisa menang - tetap server-safe tanpa hook.
// Basis MUI (MuiBox) untuk multi-platform; tanpa visual, tanpa ...rest ke DOM,
// tanpa style passthrough.
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
