import { createCss } from "../kelir-variants";

// EdTech Course Platform: vibrant gamified learning, orange CTA, purple/blue
// accents, progress badges, light scheme. DESIGN.md front matter (primary
// orange #FF6B00, secondary purple #7C3AED, tertiary blue #2563EB, neutral
// white #FFFFFF, surface light grey #F8FAFC) + yellow warning accent. Ease-out
// motion (entry 420ms, stagger 80ms) = easeMotion default. Poppins display.
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#FF6B00", // Orange (warm accent / CTA)
  secondary: "#7C3AED", // Purple (accent / emphasis)
  tertiary: "#2563EB", // Blue (accent highlight / links)
  neutral: "#FFFFFF", // White (neutral / secondary surface)
  // Warna turunan semantik
  textPrimary: "#1F2937", // Charcoal (primary text, off-black)
  textSecondary: "#64748B", // Slate (secondary text)
  onPrimary: "#FFFFFF", // White (text on orange primary)
  onSecondary: "#FFFFFF", // White (text on purple)
  onDestructive: "#FFFFFF", // White (text on destructive)
  destructive: "#DC2626", // Solid red (destructive background)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background: "#F8FAFC", // Light grey canvas
  baseBackground: "#F8FAFC", // solid canvas base (same as background for flat themes)
  surface: "#FFFFFF", // White paper surface
  borderLight: "rgba(15, 23, 42, 0.08)",
  borderMedium: "rgba(15, 23, 42, 0.14)",
  borderStrong: "rgba(15, 23, 42, 0.28)",
  dividerDark: "rgba(15, 23, 42, 0.06)",
  trackDark: "rgba(15, 23, 42, 0.12)",
  shadowDark: "rgba(15, 23, 42, 0.1)",
  shadowLight: "rgba(255, 255, 255, 0.9)",
} as const;

export type VariantName = keyof typeof variants;

// EdTech: clean, quiet shadows with a subtle lift on hover.
export const shadows = {
  card: "0 2px 12px rgba(15, 23, 42, 0.08), 0 8px 24px rgba(15, 23, 42, 0.04)",
  convex:
    "0 4px 14px rgba(15, 23, 42, 0.12), 0 12px 32px rgba(15, 23, 42, 0.08)",
  concave: "inset 0 2px 6px rgba(15, 23, 42, 0.06)",
} as const;

export const rounded = {
  sm: "12px", // DESIGN base radius
  md: "24px",
  lg: "36px",
} as const;

export const typography = {
  h1: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: "2.25rem",
    fontWeight: 700,
  },
  bodyMd: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: "1rem",
    fontWeight: 400,
  },
  labelCaps: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: "0.875rem",
    fontWeight: 500,
    letterSpacing: "0.02em",
  },
} as const;

export const css = createCss(variants, shadows, rounded);

export const tokens = {
  version: "alpha",
  name: "EdTech Course Platform",
  description:
    "Vibrant gamified EdTech learning platform: online courses, progress badges, orange CTAs, motivational and playful accents. Landing pages, modern websites.",
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
      backgroundColor: variants.primary, // DESIGN {colors.primary} orange
      color: variants.onPrimary, // DESIGN {colors.neutral} white
      rounded: rounded.sm,
      padding: "12px",
    },
  },
} as const;
