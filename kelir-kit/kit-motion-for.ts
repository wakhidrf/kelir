import type { KelirMotionTokens, MotionFamily } from "./kit-motion-types";
import {
  easeMotion,
  liquidGlassMotion,
  springMotion,
} from "./kit-motion-tokens";

/** Duration + easing families shared with kelir-design/kelir-styles.css theme filter. */
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