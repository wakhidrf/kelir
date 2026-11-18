// Single source of truth for motion / transition tokens, per the shared
// `## Elevation & Depth` section (entry/hover/page physics) in every design.md.
//
// Unlike layout, motion DIFFERS between the four themes but falls into two
// groups: the calm "ease-out" family (neumorphism + glassmorphism) and the
// springier, weighted family (claymorphism + skeuomorphism).
//
// Components reference these via `css.motion`, which resolves to CSS variables
// emitted per-theme by KelirProvider (see kelir-styles themeVars). The values
// below are theme-agnostic fallbacks used only as var() fallbacks.
//
// Barrel: types live in ./kelir-motion-types, token sets in
// ./kelir-motion-tokens. Names & shapes are unchanged.

import type { KelirMotionTokens, MotionFamily } from "./kelir-motion-types";
import {
  easeMotion,
  liquidGlassMotion,
  springMotion,
} from "./kelir-motion-tokens";

export type {
  KelirMotionDuration,
  KelirMotionEasing,
  KelirMotionTokens,
  MotionFamily,
} from "./kelir-motion-types";
export { easeMotion, liquidGlassMotion, springMotion };

/** Duration + easing families shared with kelir-styles.css theme filter. */
export function motionFamily(theme: string): MotionFamily {
  return theme === "claymorphism" || theme === "skeuomorphism"
    ? "spring"
    : "ease";
}

// Mapping theme -> motion token set.
export function motionFor(theme: string): KelirMotionTokens {
  if (theme === "liquid-glass" || theme === "aurora-ui")
    return liquidGlassMotion;
  return motionFamily(theme) === "spring" ? springMotion : easeMotion;
}