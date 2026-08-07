// Single source of truth for motion / transition tokens, per the shared
// `## Elevation & Depth` section (entry/hover/page physics) in every design.md.
//
// Unlike layout, motion DIFFERS between the four themes but falls into two
// groups: the calm "ease-out" family (neumorphism + glassmorphism) and the
// springier, weighted family (claymorphism + skeuomorphism).
//
// Components reference these via `css.motion`, which resolves to CSS variables
// emitted per-theme by KelirProvider (see kelir-styles themeVars). The values
// below are the neumorphism defaults used as var() fallbacks.

export interface KelirMotionDuration {
  /** Base physics duration. */
  base: string;
  /** Hover / small interactions. */
  hover: string;
  /** Entry animation duration. */
  entry: string;
  /** Fade between items (stagger cascade). */
  stagger: string;
  /** Page-level transition. */
  page: string;
}

export interface KelirMotionEasing {
  /** Named curve. */
  curve: string;
  /** Optional spring stiffness (spring family only). */
  stiffness?: string;
  /** Optional spring damping (spring family only). */
  damping?: string;
}

export interface KelirMotionTokens {
  duration: KelirMotionDuration;
  easing: KelirMotionEasing;
  entry: { translateY: string; opacity: string };
  hover: { scale: string };
  blur: { backdrop: string };
}

export type MotionFamily = "ease" | "spring";

/** Duration + easing families shared with kelir-styles.css theme filter. */
export function motionFamily(theme: string): MotionFamily {
  return theme === "claymorphism" || theme === "skeuomorphism"
    ? "spring"
    : "ease";
}

// Liquid Glass (premium, springy, fluid 400-600ms).
export const liquidGlassMotion: KelirMotionTokens = {
  duration: {
    base: "280ms",
    hover: "200ms",
    entry: "480ms",
    stagger: "100ms",
    page: "300ms",
  },
  easing: { curve: "spring", stiffness: "120", damping: "20" },
  entry: { translateY: "16px", opacity: "0" },
  hover: { scale: "1.03" },
  blur: { backdrop: "blur(20px)" },
} as const;

// Neumorphism (calm / ease-out) defaults.
export const easeMotion: KelirMotionTokens = {
  duration: {
    base: "250ms",
    hover: "200ms",
    entry: "420ms",
    stagger: "80ms",
    page: "200ms",
  },
  easing: { curve: "ease-out" },
  entry: { translateY: "16px", opacity: "0" },
  hover: { scale: "1" },
  blur: { backdrop: "blur(12px)" },
} as const;

// Claymorphism + Skeuomorphism (weighted / springy).
export const springMotion: KelirMotionTokens = {
  duration: {
    base: "320ms",
    hover: "200ms",
    entry: "540ms",
    stagger: "120ms",
    page: "300ms",
  },
  easing: { curve: "spring", stiffness: "120", damping: "20" },
  entry: { translateY: "16px", opacity: "0" },
  hover: { scale: "1.03" },
  blur: { backdrop: "blur(12px)" },
} as const;

// Mapping theme -> motion token set.
export function motionFor(theme: string): KelirMotionTokens {
  if (theme === "liquid-glass") return liquidGlassMotion;
  return motionFamily(theme) === "spring" ? springMotion : easeMotion;
}
