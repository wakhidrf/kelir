// Variants token types. Split out of kelir-variants.ts (SRP, one
// responsibility, <= 100 lines); the kelir-variants.ts barrel re-exports them.
// Names and shapes are unchanged.

export interface KelirVariants {
  // Core colors from DESIGN.md
  primary: string;
  secondary: string;
  tertiary: string;
  neutral: string;
  // Derived semantic colors (free per-theme values, fixed key names)
  textPrimary: string;
  textSecondary: string;
  onPrimary: string;
  onSecondary: string;
  onDestructive: string;
  destructive: string;
  background: string;
  baseBackground: string;
  surface: string;
  borderLight: string;
  borderMedium: string;
  borderStrong: string;
  dividerDark: string;
  trackDark: string;
  shadowDark: string;
  shadowLight: string;
}

export interface KelirShadows {
  card: string;
  convex: string;
  concave: string;
}

export interface KelirRounded {
  sm: string;
  md: string;
  lg: string;
}