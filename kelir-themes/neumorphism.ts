import { createCss } from "../kelir-variants";

// Neumorphism: soft 3D, monochrome light scheme. DESIGN.md front matter
// (primary #C8E0F4 / secondary #F5E0E8 / tertiary #E8E8E8 / neutral #2C4A63).
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#C8E0F4", // Soft Blue
  secondary: "#F5E0E8", // Soft Pink
  tertiary: "#E8E8E8", // Soft Grey
  neutral: "#2C4A63", // Deep Blue (neutral / text)
  // Warna turunan semantik
  textPrimary: "#333333", // Charcoal (primary text)
  textSecondary: "#666666", // Slate (secondary text)
  onPrimary: "#2C4A63", // Deep Blue (text on primary)
  onSecondary: "#632C41", // Deep Pink (text on secondary)
  onDestructive: "#900C3F", // Deep Red (text on destructive)
  destructive: "#FFCCD5", // Soft Red (destructive background)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background: "#E8E8E8", // Neumorphic background
  surface: "#E8E8E8", // Neumorphic surface (blend with background)
  borderLight: "rgba(255, 255, 255, 0.4)",
  borderMedium: "rgba(255, 255, 255, 0.5)",
  borderStrong: "rgba(255, 255, 255, 0.6)",
  dividerDark: "rgba(0, 0, 0, 0.05)",
  trackDark: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.08)",
  shadowLight: "rgba(255, 255, 255, 0.9)",
} as const;

export type VariantName = keyof typeof variants;

// Soft extruded double shadows (dark + light).
export const shadows = {
  card: "3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8)",
  convex: `5px 5px 15px ${variants.shadowDark}, -5px -5px 15px ${variants.shadowLight}`,
  concave: `inset 5px 5px 10px ${variants.shadowDark}, inset -5px -5px 10px ${variants.shadowLight}`,
} as const;

export const rounded = {
  sm: "14px",
  md: "28px",
  lg: "42px",
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
  name: "Neumorphism",
  description: "Neumorphic UI with soft 3D effects.",
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