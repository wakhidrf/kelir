import { liquidGlassMotion } from "../kelir-motion";
import { createCss } from "../kelir-variants";
// Liquid Glass: dark theme, same exact colors as DESIGN.md front matter.
// primary #1A1A1A, secondary #4A4A4A, tertiary #0066FF, neutral #FFFFFF.
// Premium fluid glass: iridescent gradients, heavy backdrop blur, chromatic
// highlights on dark surfaces.
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#1A1A1A", // DESIGN primary (deep charcoal)
  secondary: "#4A4A4A", // DESIGN secondary (graphite)
  tertiary: "#0066FF", // DESIGN tertiary (electric blue accent)
  neutral: "#FFFFFF", // DESIGN neutral (text)
  // Warna turunan semantik
  textPrimary: "#FFFFFF", // neutral (primary text on dark glass)
  textSecondary: "rgba(255, 255, 255, 0.65)", // softly muted white
  onPrimary: "#FFFFFF", // neutral (text on primary)
  onSecondary: "#FFFFFF", // neutral (text on secondary)
  onDestructive: "#FFFFFF", // neutral (text on destructive)
  destructive: "#C0372B", // derived deep red (destructive)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background:
    "radial-gradient(1200px 800px at 15% -10%, rgba(0, 102, 255, 0.35) 0%, transparent 55%), radial-gradient(1000px 700px at 110% 30%, rgba(0, 204, 255, 0.25) 0%, transparent 50%), radial-gradient(900px 600px at 85% 90%, rgba(255, 0, 200, 0.14) 0%, transparent 55%), linear-gradient(180deg, #12131A 0%, #0C0D14 100%)", // iridescent deep space-blue canvas
  surface: "rgba(255, 255, 255, 0.06)", // frosted dark glass surface
  borderLight: "rgba(255, 255, 255, 0.14)",
  borderMedium: "rgba(255, 255, 255, 0.22)",
  borderStrong: "rgba(255, 255, 255, 0.34)",
  dividerDark: "rgba(255, 255, 255, 0.08)",
  trackDark: "rgba(255, 255, 255, 0.14)",
  shadowDark: "rgba(0, 0, 0, 0.55)",
  shadowLight: "rgba(255, 255, 255, 0.06)",
} as const;

export type VariantName = keyof typeof variants;

// Layered glass shadows (deep contrast lift).
export const shadows = {
  card: "0 2px 12px rgba(0, 0, 0, 0.45), 0 10px 30px rgba(0, 0, 0, 0.35)",
  convex:
    "0 1px 2px rgba(255,255,255,0.05) inset, 0 0 20px rgba(0, 102, 255, 0.12), 0 12px 32px rgba(0, 0, 0, 0.5)",
  concave:
    "inset 0 2px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.05)",
} as const;

export const rounded = {
  sm: "8px",
  md: "12px",
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

export const css = createCss(variants, shadows, rounded, liquidGlassMotion);

export const tokens = {
  version: "alpha",
  name: "Liquid Glass",
  description:
    "Premium liquid glass effect with morphing shapes, flowing animations, chromatic aberration and iridescent gradients. Landing pages, SaaS.",
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
      padding: "12px 24px",
    },
  },
} as const;
