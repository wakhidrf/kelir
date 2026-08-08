import { springMotion } from "../kelir-motion";
import { createCss } from "../kelir-variants";
// Spatial UI (VisionOS): frosted white glass primary #FFFFFF per DESIGN.md
// front matter (only primary is defined; the rest are derived). Light scheme
// with very generous corner radius (24/48/72), floating glass panels and
// spring physics. MATCHES springMotion (entry 540ms, stagger 120ms).
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#FFFFFF", // DESIGN primary (frosted glass white)
  secondary: "#E8F1F8", // derived soft glass-blue (secondary glass)
  tertiary: "#39C8FF", // derived spatial cyan accent
  neutral: "#0A0A0F", // derived deep ink (text / neutral)
  // Warna turunan semantik
  textPrimary: "#1A1B22", // charcoal (primary text on glass)
  textSecondary: "rgba(10, 10, 15, 0.65)", // muted ink (secondary text)
  onPrimary: "#1A1B22", // ink (text on frosted glass)
  onSecondary: "#1A1B22", // ink (text on glass-blue)
  onDestructive: "#FFFFFF", // white (text on destructive)
  destructive: "#C0372B", // derived deep red (destructive)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background:
    "radial-gradient(1200px 900px at 15% -10%, #3AA0FF 0%, transparent 55%), radial-gradient(900px 700px at 110% 20%, #39C8FF 0%, transparent 50%), linear-gradient(180deg, #EDF4FB 0%, #DFE9F2 100%)", // soft aerial glass-blue backdrop
  baseBackground: "#DFE9F2", // solid canvas base (gradient tail) for below-the-fold body
  surface: "rgba(255, 255, 255, 0.55)", // frosted white glass surface
  borderLight: "rgba(255, 255, 255, 0.7)",
  borderMedium: "rgba(255, 255, 255, 0.85)",
  borderStrong: "rgba(255, 255, 255, 0.95)",
  dividerDark: "rgba(10, 15, 20, 0.06)",
  trackDark: "rgba(10, 15, 20, 0.12)",
  shadowDark: "rgba(20, 40, 70, 0.16)",
  shadowLight: "rgba(255, 255, 255, 0.9)",
} as const;

export type VariantName = keyof typeof variants;

// Floating spatial shadows (soft, diffused).
export const shadows = {
  card: "0 2px 12px rgba(0, 0, 0, 0.06), 0 20px 50px rgba(20, 40, 70, 0.12)",
  convex:
    "0 2px 6px rgba(255,255,255,0.5) inset, 0 12px 34px rgba(20, 40, 70, 0.14)",
  concave:
    "inset 0 2px 6px rgba(20, 40, 70, 0.08), inset 0 -1px 2px rgba(255, 255, 255, 0.6)",
} as const;

export const rounded = {
  sm: "24px", // DESIGN smooth (button / chip)
  md: "48px", // DESIGN md
  lg: "72px", // DESIGN lg
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
  name: "Spatial UI (VisionOS)",
  description:
    "VisionOS-style spatial interface with frosted glass panels, very large corner radius and immersive depth. Landing pages, SaaS.",
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
      backgroundColor: variants.primary, // DESIGN {colors.primary}
      color: variants.onPrimary,
      rounded: rounded.sm, // DESIGN {rounded.sm} 24px
      padding: "12px 24px",
    },
  },
} as const;
