import { springMotion } from "../kelir-motion";
import { createCss } from "../kelir-variants";
// Futuristic UI Glassmorphism: dark futuristic glass. DESIGN.md front matter
// colors (primary #020814 / secondary #FFFFFF / tertiary #00F0FF / neutral
// #000000), Exo 2 typography, generous 16/32/48 radius, neon cyan accents and
// spring physics (entry 540ms, stagger 120ms).
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#020814", // DESIGN primary (deep space navy)
  secondary: "#FFFFFF", // DESIGN secondary (glass white)
  tertiary: "#00F0FF", // DESIGN tertiary (neon cyan accent)
  neutral: "#000000", // DESIGN neutral (pure black)
  // Warna turunan semantik
  textPrimary: "#FFFFFF", // DESIGN text (primary text on dark)
  textSecondary: "rgba(255, 255, 255, 0.6)", // muted white (secondary text)
  onPrimary: "#00F0FF", // neon cyan (text on dark primary)
  onSecondary: "#020814", // space navy (text on glass white)
  onDestructive: "#FFFFFF", // white (text on destructive)
  destructive: "#C0372B", // derived deep red (destructive)
  // Warna turunan (nilai bebas per tema, nama key fix)
  background:
    "radial-gradient(1200px 800px at 15% -10%, rgba(0, 240, 255, 0.22) 0%, transparent 55%), radial-gradient(1000px 700px at 110% 30%, rgba(0, 112, 255, 0.25) 0%, transparent 50%), linear-gradient(180deg, #030A18 0%, #020814 100%)", // deep space navy with cyan glow
  baseBackground: "#020814", // solid canvas base (gradient tail) for below-the-fold body
  surface: "rgba(255, 255, 255, 0.05)", // frosted dark glass surface
  borderLight: "rgba(0, 240, 255, 0.2)", // glowing border (DESIGN border glow)
  borderMedium: "rgba(0, 240, 255, 0.35)",
  borderStrong: "rgba(0, 240, 255, 0.55)",
  dividerDark: "rgba(255, 255, 255, 0.08)",
  trackDark: "rgba(255, 255, 255, 0.14)",
  shadowDark: "rgba(0, 0, 0, 0.6)", // DESIGN shadow
  shadowLight: "rgba(0, 240, 255, 0.1)",
} as const;

export type VariantName = keyof typeof variants;

// Neon glow + dark layered shadows.
export const shadows = {
  card: "0 2px 12px rgba(0, 0, 0, 0.06), 0 10px 30px rgba(0, 0, 0, 0.35)",
  convex:
    "0 0 0 1px rgba(0, 240, 255, 0.12) inset, 0 0 24px rgba(0, 240, 255, 0.12), 0 12px 32px rgba(0, 0, 0, 0.5)",
  concave:
    "inset 0 2px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.04)",
} as const;

export const rounded = {
  sm: "16px", // DESIGN sm
  md: "32px", // DESIGN md
  lg: "48px", // DESIGN lg
} as const;

export const typography = {
  h1: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: "2.5rem", // DESIGN h1
    fontWeight: 700,
  },
  bodyMd: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: "1rem",
    fontWeight: 400,
  },
  labelCaps: {
    fontFamily: '"Exo 2", sans-serif',
    fontSize: "0.75rem",
    fontWeight: 500,
  },
} as const;

export const css = createCss(variants, shadows, rounded, springMotion);

export const tokens = {
  version: "alpha",
  name: "Futuristic UI Glassmorphism",
  description:
    "Futuristic glass UI with transparent panels, blur effects, glowing edges, dark background and 3D interface. Landing pages, modern websites.",
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
      rounded: rounded.sm, // DESIGN {rounded.sm} 16px
      padding: "12px 24px",
    },
  },
} as const;
