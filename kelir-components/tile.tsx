import MuiBox from "@mui/material/Box";
import type { TileProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Ukuran-tetap milik kit (selaras tinggi Image sm/md/lg); tanpa `size` =
// ubin-ikon fleksibel (padding token).
const sizes = {
  sm: 32,
  md: 48,
  lg: 64,
} as const;

// Ubin ikon/logo sealed (P1b STYLE.md): `tone?` MAKNA (latar + teks dari
// token; plain = surface + border terang agar terbaca di atas surface).
// Radius token (sm ≈ 10 px IconTile asal, kini milik tema); tanpa shadow.
// Basis MUI (MuiBox) agar di tree tema. Tanpa ...rest ke DOM dan tanpa
// style passthrough — di luar kontrak = pelanggaran.
export function Tile({
  children,
  tone = "primary",
  size,
  id,
  "aria-label": ariaLabel,
}: TileProps) {
  const palette =
    tone === "primary"
      ? { bg: css.colors.primary, fg: css.on.primary }
      : tone === "secondary"
        ? { bg: css.colors.secondary, fg: css.on.secondary }
        : { bg: css.colors.surface, fg: css.colors.textPrimary };
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: size ? 0 : css.layout.space.sm,
        ...(size
          ? ({
              width: sizes[size],
              height: sizes[size],
              flexShrink: 0,
              overflow: "hidden",
            } as const)
          : null),
        borderRadius: css.radius.sm,
        backgroundColor: palette.bg,
        color: palette.fg,
        ...(tone === "plain"
          ? { border: `1px solid ${css.border.light}` }
          : null),
        fontFamily: "inherit",
      }}
    >
      {children}
    </MuiBox>
  );
}
