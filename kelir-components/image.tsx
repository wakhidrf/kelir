import MuiBox from "@mui/material/Box";
import type { ImageProps } from "../kelir-types";
import { css } from "../kelir-variants";

const heights = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  "2xl": 128,
  "3xl": 160,
  "4xl": 200,
  "5xl": 256,
  "6xl": 320,
  "7xl": 400,
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
// `fluid?` = lebar mengisi wadah + tinggi auto (rasio asli terjaga) untuk
// media dekoratif/hero; `maxHeight?` membatasi tinggi dari skala yang sama;
// `maxWidth?` membatasi lebar dalam px (preseden TruncatedText.maxWidth).
// `fill?` = mengisi penuh wadah ber-posisi (mis. di dalam AspectRatio);
// `priority?` = loading eager + fetchPriority high; `sizes?` = petunjuk ukuran
// tampil untuk pemilihan sumber.
// `alt` selalu dirender sebagai atribut (string kosong bila tak diisi) agar
// lolos axe image-alt. Tanpa shadow/border default, tanpa ...rest ke DOM dan
// tanpa style passthrough — di luar kontrak = pelanggaran.
export function Image({
  src,
  alt,
  height = "md",
  fluid = false,
  maxHeight,
  maxWidth,
  fit = "contain",
  radius = "none",
  fill = false,
  priority = false,
  sizes,
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
      sizes={sizes}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      style={{
        display: "block",
        ...(fill
          ? ({
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            } as const)
          : fluid
            ? ({ width: "100%", height: "auto" } as const)
            : ({ height: heights[height], width: "auto" } as const)),
        maxWidth:
          fill || maxWidth === undefined ? (fill ? "none" : "100%") : maxWidth,
        ...(maxHeight
          ? ({ maxHeight: heights[maxHeight] } as const)
          : null),
        objectFit: fit,
        borderRadius: radii[radius],
      }}
    />
  );
}
