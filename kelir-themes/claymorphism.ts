import { springMotion } from "../kelir-motion";
import { createCss } from "../kelir-variants";

// Claymorphism: puffy, toy-like, thick borders + inner/outer shadows. Pastel
// but slightly more chromatic than neumorphism. Light scheme.
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#FDBCB4", // Soft Peach (primary surface)
  secondary: "#ADD8E6", // Baby Blue (secondary accent)
  tertiary: "#98FF98", // Mint (supporting accent)
  neutral: "#E6E6FA", // Lavender (DESIGN neutral / highlight)
  // Warna turunan semantik
  textPrimary: "#3A2E2C", // Dark warm grey (primary text)
  textSecondary: "#8A7A76", // Muted grey (secondary text)
  onPrimary: "#6E4A3C", // Warm brown (text on primary)
  onSecondary: "#2C4A63", // Deep blue (text on secondary)
  onDestructive: "#632C41", // Deep red (text on destructive)
  destructive: "#F4A9A2", // Muted peach-red (destructive background)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background: "#F5F0EE", // Warm clay canvas
  surface: "#FFFFFF", // Paper surface
  borderLight: "#E9D8D4", // Soft border
  borderMedium: "#DCC9C4", // Medium border
  borderStrong: "#C9B4AE", // Strong border
  dividerDark: "rgba(110, 74, 60, 0.1)",
  trackDark: "rgba(110, 74, 60, 0.16)",
  shadowDark: "rgba(184, 134, 120, 0.35)",
  shadowLight: "rgba(255, 255, 255, 0.9)",
} as const;

export type VariantName = keyof typeof variants;

// Thick borders + double shadows (outer + inner) per claymorphism.
export const shadows = {
  card: "0 4px 0 rgba(201, 180, 172, 0.6), 0 8px 20px rgba(184, 134, 120, 0.25)",
  convex:
    "0 3px 0 rgba(201, 180, 172, 0.6), 0 6px 16px rgba(184, 134, 120, 0.3)",
  concave: "inset 0 3px 6px rgba(110, 74, 60, 0.25)",
} as const;

export const rounded = {
  sm: "20px",
  md: "40px",
  lg: "60px",
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

export const css = createCss(variants, shadows, rounded, springMotion);

export const tokens = {
  version: "alpha",
  name: "Claymorphism",
  description:
    "Playful toy-like UI: soft 3D, chunky, thick borders, double shadows, pastel, rounded. Kids/creative/educational/games.",
  colors: {
    primary: variants.primary,
    secondary: variants.secondary,
    tertiary: variants.tertiary,
    neutral: variants.neutral,
    background: variants.background,
    surface: variants.surface,
    textPrimary: variants.textPrimary,
    textSecondary: variants.textSecondary,
    onPrimary: variants.onPrimary,
    onSecondary: variants.onSecondary,
    onDestructive: variants.onDestructive,
    destructive: variants.destructive,
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
      color: variants.onPrimary,
      rounded: rounded.sm,
      padding: "12px",
    },
  },
} as const;
