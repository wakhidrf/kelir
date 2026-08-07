import { createCss } from "../kelir-variants";

export const variants = {
  // Palet inti (10 warna, fix antar tema)
  primary: "#0080FF", // Electric Blue (primary accent)
  secondary: "#8B00FF", // Neon Purple (secondary accent)
  tertiary: "#FF1493", // Vivid Pink (accent, emphasis)
  quaternary: "#FFFFFF", // White (text on primary)
  quinary: "#FFFFFF", // White (text on secondary)
  senary: "#FFFFFF", // White (text on destructive)
  septenary: "#FF1493", // Vivid Pink (destructive background)
  octonary: "#FFFFFF", // White (primary text on glass)
  nonary: "rgba(255, 255, 255, 0.7)", // Soft white (secondary text)
  denary: "#FFFFFF", // White (highlight)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background:
    "radial-gradient(1200px 800px at 20% 0%, #0080FF 0%, transparent 60%), radial-gradient(1000px 700px at 90% 20%, #8B00FF 0%, transparent 55%), radial-gradient(900px 700px at 60% 100%, #FF1493 0%, transparent 60%), linear-gradient(180deg, #0A0E27 0%, #1B1035 100%)", // Vibrant gradient behind the glass
  surface: "rgba(255, 255, 255, 0.12)", // Frosted glass surface
  borderLight: "rgba(255, 255, 255, 0.2)",
  borderMedium: "rgba(255, 255, 255, 0.3)",
  borderStrong: "rgba(255, 255, 255, 0.4)",
  dividerDark: "rgba(255, 255, 255, 0.1)",
  trackDark: "rgba(255, 255, 255, 0.15)",
  shadowDark: "rgba(0, 0, 0, 0.2)",
  shadowLight: "rgba(255, 255, 255, 0.15)",
} as const;

export type VariantName = keyof typeof variants;

export const shadows = {
  card: "0 2px 12px rgba(0, 0, 0, 0.06)",
  convex: "0 4px 20px rgba(0, 0, 0, 0.12)",
  concave: "inset 0 1px 4px rgba(0, 0, 0, 0.08)",
} as const;

export const rounded = {
  sm: "4px",
  md: "8px",
  lg: "16px",
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
  name: "Glassmorphism",
  description:
    "Glassmorphic UI with frosted glass effect. Overlays, dialogs, cards, premium interfaces.",
  colors: {
    primary: variants.primary,
    secondary: variants.secondary,
    tertiary: variants.tertiary,
    background: variants.background,
    surface: variants.surface,
    textPrimary: variants.octonary,
    textSecondary: variants.nonary,
    onPrimary: variants.quaternary,
    onSecondary: variants.quinary,
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
      color: variants.quaternary,
      rounded: rounded.sm,
      padding: "12px",
    },
  },
} as const;
