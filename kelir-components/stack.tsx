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

// `minHeight="screen"` = satu layar penuh (dvv supaya benar di mobile).
const SCREEN_HEIGHT = "100dvh";

function minHeightValue(
  minHeight: NonNullable<StackProps["minHeight"]>,
): string {
  return minHeight === "screen" ? SCREEN_HEIGHT : css.layout.space[minHeight];
}

// Primitif layout sealed (P1b STYLE.md): susunan + jarak + perataan dari
// token css.layout. `align`/`justify` union tertutup nilai logis
// (RTL-benar); default stretch/start = perilaku lama (nol-ubah visual).
// `wrap?` = flex-wrap milik kit (default `false`, properti dihilangkan
// penuh saat mati). `directionMd?` = arah pada lebar >= 768px (token
// heroCollapse); tanpa = `direction` berlaku di semua lebar (perilaku lama).
// `minHeight?` = tinggi minimum dari skala space token atau `screen`
// (= 100dvh) untuk hero/interstitial satu layar (menyediakan ruang tetap
// untuk konten async/pihak ketiga; default tanpa tinggi). `reverseMd?` =
// balik urutan anak pada lebar >= 768px (token heroCollapse; arah dasar
// `gapMd?` = jarak pada lebar >= 768px (token heroCollapse); tanpa =
// `gap` berlaku di semua lebar (perilaku lama).
// `directionMd ?? direction`, default `false`). Tanpa warna/border/shadow/font.
// Basis MUI (MuiBox = div + emotion + tema di tree) untuk multi-platform;
// visual milik kit. Tanpa ...rest ke DOM dan tanpa style passthrough — di
// luar kontrak = pelanggaran.
export function Stack({
  children,
  gap = "md",
  direction = "column",
  directionMd,
  gapMd,
  reverseMd = false,
  minHeight,
  align = "stretch",
  justify = "start",
  wrap = false,
  id,
  "aria-label": ariaLabel,
}: StackProps) {
  const responsiveDirection = directionMd !== undefined || reverseMd;
  const responsiveGap = gapMd !== undefined;

  const mdDirection = reverseMd
    ? `${directionMd ?? direction}-reverse`
    : directionMd;
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={
        responsiveDirection || responsiveGap
          ? {
              ...(responsiveDirection
                ? { flexDirection: direction }
                : null),
              [MD_QUERY]: {
                ...(responsiveDirection
                  ? { flexDirection: mdDirection }
                  : null),
                ...(responsiveGap ? { gap: gaps[gapMd] } : null),
              },
            }
          : undefined
      }
      style={{
        display: "flex",
        // Arah dasar tetap inline (perilaku lama); saat arah responsif
        // dipakai, arah dipindah ke `sx` agar media query bisa menang.
        ...(responsiveDirection ? null : ({ flexDirection: direction } as const)),
        ...(responsiveGap ? null : ({ gap: gaps[gap] } as const)),
        alignItems: align,
        justifyContent: justify,
        ...(minHeight
          ? ({ minHeight: minHeightValue(minHeight) } as const)
          : null),
        ...(wrap ? ({ flexWrap: "wrap" } as const) : null),
      }}
    >
      {children}
    </MuiBox>
  );
}
