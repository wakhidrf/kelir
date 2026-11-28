import { liquidGlassMotion } from "../../kelir-kit/kit-motion-tokens";
import { createCss } from "../../kelir-kit/kit-create-css";
import { rounded, typography } from "./aurora-ui-scale";
export { rounded, typography };
// Aurora UI: dark theme inspired by Northern Lights. DESIGN.md front matter
// defines primary/Electric Blue #0080FF, secondary/Magenta #FF1493,
// tertiary/Cyan #00FFFF (no neutral); the rest are derived. Flowing mesh
// gradient canvas, spring physics (entry 480ms, stagger 100ms). MATCHES
// liquidGlassMotion.
export const variants = {
  // Core colors from DESIGN.md
  primary: "#0080FF", // DESIGN primary (Electric Blue accent)
  secondary: "#FF1493", // DESIGN secondary (Magenta accent)
  tertiary: "#00FFFF", // DESIGN tertiary (Cyan accent)
  neutral: "#0B1020", // derived deep space navy (text / neutral)
  // Derived semantic colors
  textPrimary: "#F2F6FF", // near-white (primary text on aurora canvas)
  textSecondary: "rgba(242, 246, 255, 0.68)", // muted blue-white
  onPrimary: "#0B1020", // deep navy (AA 4.99 on electric blue)
  onSecondary: "#0B1020", // deep navy (AA 5.20 on magenta)
  onDestructive: "#0B1020", // deep navy (AA 4.84 on destructive)
  destructive: "#E5484D", // derived vivid red (destructive)
  // Derived colors (free per-theme values, fixed key names)
  background:
    "radial-gradient(1200px 800px at 85% -10%, rgba(0, 128, 255, 0.4) 0%, transparent 55%), radial-gradient(1000px 700px at 10% 110%, rgba(255, 20, 147, 0.32) 0%, transparent 52%), radial-gradient(900px 600px at 55% 55%, rgba(0, 255, 255, 0.14) 0%, transparent 50%), linear-gradient(180deg, #0B0E1A 0%, #060711 100%)", // flowing aurora mesh on deep navy
  baseBackground: "#060711", // solid canvas base (gradient tail) for below-the-fold body
  surface: "rgba(255, 255, 255, 0.07)", // translucent aurora surface
  borderLight: "rgba(255, 255, 255, 0.14)",
  borderMedium: "rgba(255, 255, 255, 0.22)",
  borderStrong: "rgba(255, 255, 255, 0.34)",
  dividerDark: "rgba(255, 255, 255, 0.08)",
  trackDark: "rgba(255, 255, 255, 0.16)",
  shadowDark: "rgba(4, 8, 20, 0.6)",
  shadowLight: "rgba(0, 128, 255, 0.18)",
} as const;

export type VariantName = keyof typeof variants;

// Luminous glow shadows (aurora lift).
export const shadows = {
  card: "0 4px 24px rgba(4, 8, 20, 0.35), 0 8px 40px rgba(0, 128, 255, 0.1)",
  convex:
    "inset 0 1px 2px rgba(255,255,255,0.06), 0 0 24px rgba(0, 128, 255, 0.14), 0 12px 32px rgba(4, 8, 20, 0.5)",
  concave:
    "inset 0 2px 8px rgba(4, 8, 20, 0.55), inset 0 -1px 2px rgba(255, 255, 255, 0.05)",
} as const;

export const css = createCss(variants, shadows, rounded, liquidGlassMotion);

export const tokens = {
  version: "alpha",
  name: "Aurora UI",
  description:
    "Vibrant gradient interface inspired by Northern Lights with mesh gradients, flowing animations. SaaS premium, creative tools, modern agency.",
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
      backgroundColor:
        "linear-gradient(135deg, #0080FF 0%, #FF1493 55%, #00FFFF 130%)",
      color: variants.onPrimary,
      rounded: rounded.sm,
      padding: "12px",
    },
  },
} as const;
