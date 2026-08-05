import { createCss } from "../kelir-variants";

export const variants = {
  // Palet inti (10 warna, fix antar tema)
  primary: "#FFD1DC", // Soft Pink
  secondary: "#E0BBE4", // Lavender
  tertiary: "#C3E5F9", // Baby Blue
  quaternary: "#FFFACD", // Lemon (accent, decorative)
  quinary: "#9D84B6", // Lilac
  senary: "#7A3B4E", // Deep Rose (text on destructive)
  septenary: "#FF9AA2", // Salmon (destructive background)
  octonary: "#4A3B5C", // Deep Purple (primary text)
  nonary: "#8A7A9C", // Soft Purple (secondary text)
  denary: "#FFFFFF", // White (glossy highlight)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background: "#FFFDF6", // Warm cream background
  surface: "#B5EAD7", // Mint surface (from DESIGN.md)
  borderLight: "rgba(157, 132, 182, 0.18)", // Lilac tint, bukan putih neumorphic
  borderMedium: "rgba(157, 132, 182, 0.26)",
  borderStrong: "rgba(157, 132, 182, 0.36)",
  dividerDark: "rgba(74, 59, 92, 0.08)",
  trackDark: "rgba(74, 59, 92, 0.14)",
  shadowDark: "rgba(157, 132, 182, 0.16)",
  shadowLight: "rgba(255, 255, 255, 0.7)",
} as const;

export type VariantName = keyof typeof variants;

// Shadow datar tunggal (soft drop), BUKAN dual convex/concave neumorphic.
export const shadows = {
  card: "0 2px 12px rgba(157, 132, 182, 0.16)",
  convex: "0 4px 14px rgba(157, 132, 182, 0.16)",
  concave: "inset 0 2px 4px rgba(74, 59, 92, 0.06)",
} as const;

export const rounded = {
  sm: "24px",
  md: "48px",
  lg: "72px",
} as const;

export const typography = {
  h1: {
    fontSize: "2.25rem",
    fontWeight: 700,
  },
  bodyMd: {
    fontSize: "1rem",
    fontWeight: 400,
  },
  labelCaps: {
    fontSize: "0.75rem",
    fontWeight: 500,
  },
} as const;

export const css = createCss(variants, shadows, rounded);

export const tokens = {
  version: "alpha",
  name: "Kawaii / Sweet Pastel",
  description: "Cute, playful, whimsical pastel design.",
  colors: {
    primary: variants.primary,
    secondary: variants.secondary,
    tertiary: variants.tertiary,
    background: variants.background,
    surface: variants.surface,
    textPrimary: variants.octonary,
    textSecondary: variants.nonary,
    onPrimary: variants.octonary,
    onSecondary: variants.octonary,
    onDestructive: variants.senary,
    destructive: variants.septenary,
    borderLight: variants.borderLight,
    borderMedium: variants.borderMedium,
    borderStrong: variants.borderStrong,
    divider: variants.dividerDark,
    track: variants.trackDark,
    shadowDark: variants.shadowDark,
    shadowLight: variants.shadowLight,
  },
  typography,
  rounded,
  shadows: {
    flat: "none",
    convex: shadows.convex,
    concave: shadows.concave,
    card: shadows.card,
  },
  components: {
    buttonPrimary: {
      backgroundColor: variants.primary,
      color: variants.octonary,
      rounded: rounded.sm,
      padding: "12px",
    },
  },
} as const;
