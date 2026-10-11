import MuiBox from "@mui/material/Box";
import type { ImageProps } from "../kelir-types";
import { css } from "../kelir-variants";

const heights = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
} as const;

const radii = {
  none: "0",
  sm: css.radius.sm,
  md: css.radius.md,
  lg: css.radius.lg,
} as const;

// Logika murni (bukan DOM): peta height MAKNA → px milik kit.
// Diuji unit langsung — jsdom tak menghitung stylesheet emotion.
export function imagePx(height: NonNullable<ImageProps["height"]>): number {
  return heights[height];
}

// Media netral sealed (P1b STYLE.md): tinggi dari union tertutup (lebar
// mengikuti rasio asli), fit contain/cover, radius token (default none).
// `alt` selalu dirender sebagai atribut (string kosong bila tak diisi)
// agar lolos axe image-alt. Tanpa shadow/border default, tanpa ...rest ke
// DOM dan tanpa style passthrough — di luar kontrak = pelanggaran.
export function Image({
  src,
  alt,
  height = "md",
  fit = "contain",
  radius = "none",
  id,
  "aria-label": ariaLabel,
}: ImageProps) {
  return (
    <MuiBox
      component="img"
      src={src}
      alt={alt ?? ""}
      id={id}
      aria-label={ariaLabel}
      style={{
        display: "block",
        height: heights[height],
        width: "auto",
        maxWidth: "100%",
        objectFit: fit,
        borderRadius: radii[radius],
      }}
    />
  );
}
