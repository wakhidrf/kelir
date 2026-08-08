import { createCss } from "../kelir-variants";
// Contemporary Editorial: artistic editorial / magazine design. DESIGN.md
// front matter (primary white, secondary black, tertiary wine-red, neutral
// dark grey) plus gold surface and navy accent. Light scheme, serif Display
// (Playfair), ease-out motion (entry 420ms, stagger 80ms) = easeMotion default.
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#FFFFFF", // DESIGN primary (white surface)
  secondary: "#000000", // DESIGN secondary (black / ink)
  tertiary: "#800000", // DESIGN tertiary (wine red accent)
  neutral: "#333333", // DESIGN neutral (dark grey)
  // Warna turunan semantik
  textPrimary: "#111111", // near-black (primary text)
  textSecondary: "rgba(17, 17, 17, 0.7)", // muted ink (secondary text)
  onPrimary: "#111111", // ink (text on white primary)
  onSecondary: "#FFFFFF", // white (text on black)
  onDestructive: "#FFFFFF", // white (text on destructive)
  destructive: "#800000", // DESIGN tertiary (wine red destructive)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background: "#FAF8F2", // warm paper canvas
  surface: "#FFFFFF", // paper surface (editorial card)
  borderLight: "rgba(0, 0, 0, 0.1)",
  borderMedium: "rgba(0, 0, 0, 0.16)",
  borderStrong: "rgba(0, 0, 0, 0.28)",
  dividerDark: "rgba(0, 0, 0, 0.08)",
  trackDark: "rgba(0, 0, 0, 0.12)",
  shadowDark: "rgba(0, 0, 0, 0.16)",
  shadowLight: "rgba(255, 255, 255, 0.9)",
} as const;

export type VariantName = keyof typeof variants;

// Editorial: quiet, print-like shadows.
export const shadows = {
  card: "0 2px 12px rgba(0, 0, 0, 0.06), 0 6px 24px rgba(0, 0, 0, 0.06)",
  convex:
    "0 2px 6px rgba(255,255,255,0.6) inset, 0 8px 24px rgba(0, 0, 0, 0.08)",
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
    fontFamily: '"Playfair Display", serif',
    fontSize: "2.25rem",
    fontWeight: 700,
  },
  bodyMd: {
    fontFamily: '"Playfair Display", serif',
    fontSize: "1rem",
    fontWeight: 400,
  },
  labelCaps: {
    fontFamily: '"Playfair Display", serif',
    fontSize: "0.75rem",
    fontWeight: 500,
  },
} as const;

export const css = createCss(variants, shadows, rounded);

export const tokens = {
  version: "alpha",
  name: "Contemporary Editorial",
  description:
    "Artistic and immersive editorial landing page for a contemporary culture and art digital magazine. Landing pages, modern websites.",
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
