// Neutral fallback values + status palette. Split out of kelir-variants.ts
// (SRP, <= 100 lines); the kelir-variants.ts barrel re-exports them. Names and
// values are unchanged.

import type { KelirRounded } from "./kelir-variants-types";

// Neutral base rounded scale (theme-agnostic fallback).
export const rounded: KelirRounded = {
  sm: "8px",
  md: "16px",
  lg: "24px",
} as const;

// Neutral base fallbacks.
// Values used ONLY as the var() fallback inside kelir-components so a component
// still has sensible colors before/without a theme's CSS variables. They are
// deliberately theme-agnostic — never tied to any single theme — so consumers
// cannot accidentally render a specific theme when the attribute is missing.
export const variants = {
  // Core neutral colors (not any theme)
  primary: "#8A8F98", // neutral gray (accent fallback)
  secondary: "#A6ABB3", // lighter gray
  tertiary: "#C4C8CE", // light gray
  neutral: "#3C4146", // dark gray (text / neutral)
  // Derived semantic colors (neutral values)
  textPrimary: "#1F2328", // near-black (primary text)
  textSecondary: "#555B63", // muted gray (secondary text)
  onPrimary: "#FFFFFF", // white (text on primary)
  onSecondary: "#FFFFFF", // white (text on secondary)
  onDestructive: "#FFFFFF", // white (text on destructive)
  destructive: "#B3261E", // neutral red (destructive background)
  background: "#F5F6F7", // neutral light canvas
  baseBackground: "#E8E8E8", // neutral opaque canvas (edge tabs, etc.)
  surface: "#FFFFFF", // neutral surface
  borderLight: "rgba(0, 0, 0, 0.08)",
  borderMedium: "rgba(0, 0, 0, 0.14)",
  borderStrong: "rgba(0, 0, 0, 0.24)",
  dividerDark: "rgba(0, 0, 0, 0.06)",
  trackDark: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.12)",
  shadowLight: "rgba(255, 255, 255, 0.8)",
} as const;

export type VariantName = keyof typeof variants;

// Status semantic palette (success/warning). Kept neutral (theme-agnostic) per
// the fallback rule: the values are deliberately unrelated to any single theme
// and are used only when the theme provides no status override of its own.
export const statusColors = {
  success: { bg: "#C8E6C9", fg: "#1B5E20" },
  warning: { bg: "#FFE0B2", fg: "#B45309" },
} as const;

export const shadows = {
  card: "0 1px 3px rgba(0, 0, 0, 0.12)",
  convex: "0 2px 8px rgba(0, 0, 0, 0.12)",
  concave: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
} as const;