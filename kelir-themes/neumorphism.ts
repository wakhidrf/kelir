import {
  css as baseCss,
  shadows as baseShadows,
  variants as baseVariants,
} from "../kelir-variants";

// Neumorphism adalah tema default, sehingga mereuse base dari kelir-variants.ts.
export const variants = baseVariants;
export const shadows = baseShadows;
export const css = baseCss;

export const rounded = {
  sm: "14px",
  md: "28px",
  lg: "42px",
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

export const tokens = {
  version: "alpha",
  name: "Neumorphism",
  description: "Neumorphic UI with soft 3D effects.",
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
      backgroundColor: variants.primary,
      rounded: rounded.sm,
      padding: "12px",
    },
  },
} as const;
