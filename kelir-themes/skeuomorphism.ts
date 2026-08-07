import { springMotion } from "../kelir-motion";
import { createCss } from "../kelir-variants";
// Skeuomorphism: same exact colors as DESIGN.md front matter.
// primary #1A1A1A, secondary #4A4A4A, tertiary #0066FF, neutral #FFFFFF.
// Dark theme (charcoal surfaces, white text).
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#1A1A1A", // DESIGN primary (charcoal)
  secondary: "#4A4A4A", // DESIGN secondary (dark grey)
  tertiary: "#0066FF", // DESIGN tertiary (electric blue accent)
  neutral: "#FFFFFF", // DESIGN neutral (text)
  // Warna turunan semantik
  textPrimary: "#FFFFFF", // neutral (primary text)
  textSecondary: "#C0C4CC", // derived muted silver (secondary text)
  onPrimary: "#FFFFFF", // neutral (text on primary)
  onSecondary: "#FFFFFF", // neutral (text on secondary)
  onDestructive: "#FFFFFF", // neutral (text on destructive)
  destructive: "#C0372B", // derived deep red (destructive)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background:
    "radial-gradient(900px 500px at 15% 0%, #4A4A4A 0%, transparent 55%), linear-gradient(170deg, #2A2A2E 0%, #1A1A1A 50%, #121214 100%)", // charcoal canvas (from primary #1A1A1A)
  surface: "#222226", // dark surface
  borderLight: "rgba(255, 255, 255, 0.12)",
  borderMedium: "rgba(255, 255, 255, 0.2)",
  borderStrong: "rgba(255, 255, 255, 0.32)",
  dividerDark: "rgba(255, 255, 255, 0.1)",
  trackDark: "rgba(255, 255, 255, 0.16)",
  shadowDark: "rgba(0, 0, 0, 0.6)",
  shadowLight: "rgba(255, 255, 255, 0.08)",
} as const;

export type VariantName = keyof typeof variants;

// Realistic layered shadows + tactile press (concave).
export const shadows = {
  card: "0 2px 12px rgba(0, 0, 0, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3)",
  convex:
    "0 1px 2px rgba(255,255,255,0.06) inset, 0 -3px 8px rgba(0,0,0,0.4) inset, 0 6px 16px rgba(0, 0, 0, 0.45)",
  concave:
    "inset 0 3px 8px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.25)",
} as const;

export const rounded = {
  sm: "8px",
  md: "14px",
  lg: "20px",
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
  name: "Skeuomorphism",
  description:
    "Realistic, textured interface with 3D depth, real-world metaphors (leather, wood, metal), layered shadows and tactile press. Landing pages, SaaS.",
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
      backgroundColor: variants.tertiary,
      color: variants.onPrimary,
      rounded: rounded.sm,
      padding: "10px 20px",
    },
  },
} as const;
