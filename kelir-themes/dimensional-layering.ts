import { springMotion } from "../kelir-motion";
import { createCss } from "../kelir-variants";
// Dimensional Layering: light theme built on layering / depth. DESIGN.md front
// matter defines primary/white, secondary/pale-grey, tertiary/soft-grey (no
// neutral); the rest are derived. Layered box-shadow elevation, spring physics
// (entry 540ms, stagger 120ms). MATCHES springMotion.
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#FFFFFF", // DESIGN primary (dominant surface)
  secondary: "#F5F5F5", // DESIGN secondary (raised surface)
  tertiary: "#E0E0E0", // DESIGN tertiary (supporting palette)
  neutral: "#1A1A1A", // derived deep charcoal (text / neutral)
  // Warna turunan semantik
  textPrimary: "#1A1A1A", // charcoal (primary text)
  textSecondary: "rgba(26, 26, 26, 0.68)", // muted ink (secondary text)
  onPrimary: "#1A1A1A", // ink (text on white primary)
  onSecondary: "#1A1A1A", // ink (text on pale grey)
  onDestructive: "#FFFFFF", // white (text on destructive)
  destructive: "#B3261E", // derived deep red (destructive)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background: "#F2F2F3", // neutral grey canvas (depth backdrop)
  surface: "#FFFFFF", // paper surface (top layer)
  borderLight: "rgba(0, 0, 0, 0.08)",
  borderMedium: "rgba(0, 0, 0, 0.12)",
  borderStrong: "rgba(0, 0, 0, 0.2)",
  dividerDark: "rgba(0, 0, 0, 0.06)",
  trackDark: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.14)",
  shadowLight: "rgba(255, 255, 255, 0.9)",
} as const;

export type VariantName = keyof typeof variants;

// Layered box-shadow elevation (4 levels feel via stacked shadows).
export const shadows = {
  card: "0 1px 2px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
  convex:
    "0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08), 0 12px 28px rgba(0,0,0,0.1)",
  concave:
    "inset 0 2px 6px rgba(0, 0, 0, 0.08), inset 0 -1px 2px rgba(255, 255, 255, 0.8)",
} as const;

export const rounded = {
  sm: "8px", // DESIGN base radius
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
  name: "Dimensional Layering",
  description:
    "Design with dimensional layering: layered surfaces, box-shadow elevation, parallax depth and floating cards. Landing pages, SaaS.",
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
      backgroundColor: variants.primary, // DESIGN {colors.primary}
      color: variants.onPrimary,
      rounded: rounded.sm,
      padding: "12px 24px",
    },
  },
} as const;
