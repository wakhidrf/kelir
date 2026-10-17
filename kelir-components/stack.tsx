import MuiBox from "@mui/material/Box";
import type { StackProps } from "../kelir-types";
import { css } from "../kelir-variants";

const gaps = {
  xs: css.layout.space.xs,
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
} as const;

// Ambang responsif kit (satu sumber: token heroCollapse 768px). Dipakai via
// `sx` supaya komponen tetap server-safe (tanpa hook/useMediaQuery).
const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

// Primitif layout sealed (P1b STYLE.md): susunan + jarak + perataan dari
// token css.layout. `align`/`justify` union tertutup nilai logis
// (RTL-benar); default stretch/start = perilaku lama (nol-ubah visual).
// `wrap?` = flex-wrap milik kit (default `false`, properti dihilangkan
// penuh saat mati). `directionMd?` = arah pada lebar >= 768px (token
// heroCollapse); tanpa = `direction` berlaku di semua lebar (perilaku lama).
// `minHeight?` = tinggi minimum dari skala space token (menyediakan ruang
// tetap untuk konten async/pihak ketiga; default tanpa tinggi). Tanpa
// warna/border/shadow/font. Basis MUI (MuiBox = div + emotion + tema di
// tree) untuk multi-platform; visual milik kit. Tanpa ...rest ke DOM dan
// tanpa style passthrough — di luar kontrak = pelanggaran.
export function Stack({
  children,
  gap = "md",
  direction = "column",
  directionMd,
  minHeight,
  align = "stretch",
  justify = "start",
  wrap = false,
  id,
  "aria-label": ariaLabel,
}: StackProps) {
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={
        directionMd
          ? {
              flexDirection: direction,
              [MD_QUERY]: { flexDirection: directionMd },
            }
          : undefined
      }
      style={{
        display: "flex",
        // Arah dasar tetap inline (perilaku lama); saat `directionMd` diisi,
        // arah dipindah ke `sx` agar media query bisa menang atas inline.
        ...(directionMd ? null : ({ flexDirection: direction } as const)),
        gap: gaps[gap],
        alignItems: align,
        justifyContent: justify,
        ...(minHeight
          ? ({ minHeight: css.layout.space[minHeight] } as const)
          : null),
        ...(wrap ? ({ flexWrap: "wrap" } as const) : null),
      }}
    >
      {children}
    </MuiBox>
  );
}
