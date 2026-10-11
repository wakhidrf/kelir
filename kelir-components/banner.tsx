import MuiBox from "@mui/material/Box";
import type { BannerProps } from "../kelir-types";
import { css, statusColors } from "../kelir-variants";

// Pasangan bg/fg milik kit (preseden Marker-note: solid, bukan warna
// mentah). `neutral` = abu token (Alert tak punya tone netral).
const bannerPalettes = {
  danger: { bg: css.destructive, fg: css.on.destructive },
  warn: statusColors.warning,
  neutral: { bg: css.colors.neutral, fg: css.colors.surface },
} as const;

// Spanduk status tengah sealed (P1b STYLE.md): teks anak mewarisi warna
// (tanpa override di dalam); rata tengah; tanpa ikon (itu `Alert`).
// Basis MUI (MuiBox) agar di tree tema. Tanpa ...rest ke DOM dan tanpa
// style passthrough — di luar kontrak = pelanggaran.
export function Banner({
  children,
  tone = "neutral",
  id,
  "aria-label": ariaLabel,
}: BannerProps) {
  const palette = bannerPalettes[tone];
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        textAlign: "center",
        padding: css.layout.space.md,
        borderRadius: css.radius.sm,
        backgroundColor: palette.bg,
        color: palette.fg,
        fontFamily: "inherit",
      }}
    >
      {children}
    </MuiBox>
  );
}
