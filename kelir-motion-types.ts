// Motion token types. Split out of kelir-motion.ts (SRP, one responsibility,
// <= 100 lines); the kelir-motion.ts barrel re-exports them. Names and shapes
// are unchanged.

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