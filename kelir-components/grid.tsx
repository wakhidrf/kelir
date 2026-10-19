import MuiBox from "@mui/material/Box";
import type { GridProps } from "../kelir-types";
import { css } from "../kelir-variants";

const gaps = {
  xs: css.layout.space.xs,
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
} as const;

// Ambang responsif kit (satu sumber: token layout) - `mobile` 600px untuk
// `columnsSm`, `heroCollapse` 768px untuk `columnsMd`. Aturan md ditulis
// setelah sm supaya ia menang saat keduanya cocok.
const SM_QUERY = `@media (min-width: ${css.layout.breakpoints.mobile})`;
const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

const columnsCss = (n: number) => `repeat(${n}, minmax(0, 1fr))`;

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
  id,
  "aria-label": ariaLabel,
}: GridProps) {
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
