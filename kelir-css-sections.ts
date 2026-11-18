// CSS token section builders (motion + typography). Split out of
// kelir-variants.ts createCss (SRP, <= 100 lines). The kelir-create-css module
// composes them into the final `css` object. Behavior is unchanged.

import type { KelirMotionTokens } from "./kelir-motion";
import { typography as baseTypography } from "./kelir-typography";

export function buildMotionTokens(motion: KelirMotionTokens) {
  return {
    duration: {
      base: `var(--motion-duration-base, ${motion.duration.base})`,
      hover: `var(--motion-duration-hover, ${motion.duration.hover})`,
      entry: `var(--motion-duration-entry, ${motion.duration.entry})`,
      stagger: `var(--motion-duration-stagger, ${motion.duration.stagger})`,
      page: `var(--motion-duration-page, ${motion.duration.page})`,
    },
    easing: {
      curve: `var(--motion-easing-curve, ${motion.easing.curve})`,
      stiffness: `var(--motion-spring-stiffness, ${motion.easing.stiffness ?? "none"})`,
      damping: `var(--motion-spring-damping, ${motion.easing.damping ?? "none"})`,
    },
    entry: {
      translateY: `var(--motion-entry-translate-y, ${motion.entry.translateY})`,
      opacity: `var(--motion-entry-opacity, ${motion.entry.opacity})`,
    },
    hover: {
      scale: `var(--motion-hover-scale, ${motion.hover.scale})`,
    },
    blur: {
      backdrop: `var(--motion-blur-backdrop, ${motion.blur.backdrop})`,
    },
  } as const;
}

export function buildTypographyTokens() {
  return {
    scale: {
      hero: `var(--type-hero, ${baseTypography.scale.hero})`,
      h1: `var(--type-h1, ${baseTypography.scale.h1})`,
      h2: `var(--type-h2, ${baseTypography.scale.h2})`,
      body: `var(--type-body, ${baseTypography.scale.body})`,
      small: `var(--type-small, ${baseTypography.scale.small})`,
      label: `var(--type-label, ${baseTypography.scale.label})`,
    },
    lineHeight: {
      body: `var(--type-lineheight-body, ${baseTypography.lineHeight.body})`,
    },
    maxCh: {
      body: `var(--type-max-ch, ${baseTypography.maxCh.body})`,
    },
    weights: {
      hero: `var(--type-weight-hero, ${baseTypography.weights.hero})`,
      h1: `var(--type-weight-h1, ${baseTypography.weights.h1})`,
      h2: `var(--type-weight-h2, ${baseTypography.weights.h2})`,
      body: `var(--type-weight-body, ${baseTypography.weights.body})`,
      label: `var(--type-weight-label, ${baseTypography.weights.label})`,
    },
  } as const;
}