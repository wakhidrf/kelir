import { createCss } from "../../kelir-kit/kit-create-css";
import { rounded, typography } from "./flat-educacional-scale";
export { rounded, typography };

// Flat Education Vibrant: shadow-free flat surfaces, saturated primaries and a
// warm orange surface. DESIGN.md front matter (primary #007BFF / secondary
// #FFD700 / tertiary #2ECC40 / neutral #FFFFFF / surface #FF8C00).
// DESIGN accent (soft purple #9370DB) has no slot: accent tone aliases primary.
export const variants = {
  // Core colors from DESIGN.md
  primary: "#007BFF", // Electric Blue
  secondary: "#FFD700", // Sun Yellow
  tertiary: "#2ECC40", // Emerald Green
  neutral: "#FFFFFF", // White
  // Derived semantic colors
  textPrimary: "#1A1A1A", // Charcoal (no pure black per DESIGN.md)
  textSecondary: "#6B6B6B", // Muted grey (secondary text)
  onPrimary: "#111111", // near-black (AA 4.75 on the blue primary)
  onSecondary: "#1A1A1A", // Charcoal (text on secondary)
  onDestructive: "#FFFFFF", // White (text on destructive)
  destructive: "#C62828", // Semantic red (error text/border)
  // Derived colors (free per-theme values, fixed key names)
  background: "#FFFFFF", // Light canvas
  baseBackground: "#FFFFFF", // solid canvas base (same as background for flat themes)
  surface: "#FF8C00", // Vibrant Orange (DESIGN surface)
  borderLight: "#F5F5F5", // Light grey (borders, muted elements)
  borderMedium: "#E0E0E0",
  borderStrong: "#C7C7C7",
  dividerDark: "rgba(0, 0, 0, 0.08)",
  trackDark: "rgba(0, 0, 0, 0.12)",
  shadowDark: "rgba(0, 0, 0, 0.06)",
  shadowLight: "rgba(255, 255, 255, 0.9)",
} as const;

export type VariantName = keyof typeof variants;

// Flat depth: a single soft drop shadow, no bevels or double lighting.
export const shadows = {
  card: "0 2px 12px rgba(0, 0, 0, 0.06)",
  convex: `0 2px 12px ${variants.shadowDark}`,
  concave: "inset 0 2px 6px rgba(0, 0, 0, 0.08)",
} as const;

export const css = createCss(variants, shadows, rounded);

export const tokens = {
  version: "alpha",
  name: "Flat Education Vibrant",
  description: "Vibrant flat design for e-learning and modern websites.",
  colors: {
    primary: variants.primary,
    secondary: variants.secondary,
    tertiary: variants.tertiary,
    neutral: variants.neutral,
    background: variants.background,
    baseBackground: variants.baseBackground,
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