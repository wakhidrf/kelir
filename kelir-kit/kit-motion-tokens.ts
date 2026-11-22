// Motion token sets (the theme-agnostic var() fallbacks). Split out of
// kelir-motion.ts (SRP, <= 100 lines); the kelir-motion.ts barrel re-exports
// them. Names and values are unchanged.

import type { KelirMotionTokens } from "./kit-motion-types";

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