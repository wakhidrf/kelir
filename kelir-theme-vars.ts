// Per-theme CSS variable block + selector. Split out of kelir-styles.ts (SRP,
// <= 100 lines); the kelir-styles.ts barrel composes them into the stylesheet.
// Behavior is unchanged.

import { motionFor } from "./kelir-motion";
import { themeRegistry } from "./kelir-registry";
import type { Theme } from "./kelir-types";
import { FONTS, SCHEMES } from "./kelir-theme-fonts";

export function themeVars(theme: Theme): string {
  const tokens = themeRegistry[theme].tokens;
  const colors = tokens.colors;
  const rounded = tokens.rounded;
  const shadows = tokens.shadows;
  const fonts = FONTS[theme];
  const motion = motionFor(theme);
  const control = tokens.components?.buttonPrimary;

  return [
    `--color-primary: ${colors.primary};`,
    `--color-secondary: ${colors.secondary};`,
    `--color-tertiary: ${colors.tertiary};`,
    `--color-neutral: ${colors.neutral};`,
    `--color-background: ${colors.background};`,
    `--color-background-base: ${colors.baseBackground};`,
    `--color-surface: ${colors.surface};`,
    `--color-text-primary: ${colors.textPrimary};`,
    `--color-text-secondary: ${colors.textSecondary};`,
    `--color-on-primary: ${colors.onPrimary};`,
    `--color-on-secondary: ${colors.onSecondary};`,
    `--color-on-destructive: ${colors.onDestructive};`,
    `--color-destructive: ${colors.destructive};`,
    `--color-border-light: ${colors.borderLight};`,
    `--color-border-medium: ${colors.borderMedium};`,
    `--color-border-strong: ${colors.borderStrong};`,
    `--color-divider: ${colors.divider};`,
    `--color-track: ${colors.track};`,
    `--radius-sm: ${rounded.sm};`,
    `--radius-md: ${rounded.md};`,
    `--radius-lg: ${rounded.lg};`,
    `--control-padding: ${control?.padding ?? "12px"};`,
    `--control-radius: ${control?.rounded ?? rounded.sm};`,
    `--control-background: ${control?.backgroundColor ?? colors.primary};`,
    `--focus-ring-width: 2px;`,
    `--focus-ring-offset: 2px;`,
    `--focus-ring-color: ${colors.primary};`,
    `--shadow-convex: ${shadows.convex};`,
    `--shadow-concave: ${shadows.concave};`,
    `--shadow-card: ${shadows.card};`,
    `--kelir-font-active: ${fonts.active};`,
    `--kelir-font-mono: ${fonts.mono};`,
    `--kelir-color-scheme: ${SCHEMES[theme] ?? "light"};`,
    `--kelir-flow-anim: ${theme === "aurora-ui" ? "kelir-aurora-flow 12s ease-in-out infinite alternate" : "none"};`,
    `--kelir-flow-opacity: ${theme === "aurora-ui" ? "1" : "0"};`,
    `--kelir-chroma: ${
      theme === "liquid-glass"
        ? "1px 0 0 rgba(0, 255, 255, 0.28), -1px 0 0 rgba(255, 0, 128, 0.28)"
        : "none"
    };`,
    `--motion-duration-base: ${motion.duration.base};`,
    `--motion-duration-hover: ${motion.duration.hover};`,
    `--motion-duration-entry: ${motion.duration.entry};`,
    `--motion-duration-stagger: ${motion.duration.stagger};`,
    `--motion-duration-page: ${motion.duration.page};`,
    `--motion-easing-curve: ${motion.easing.curve};`,
    `--motion-spring-stiffness: ${motion.easing.stiffness ?? "none"};`,
    `--motion-spring-damping: ${motion.easing.damping ?? "none"};`,
    `--motion-entry-translate-y: ${motion.entry.translateY};`,
    `--motion-entry-opacity: ${motion.entry.opacity};`,
    `--motion-hover-scale: ${motion.hover.scale};`,
    `--motion-blur-backdrop: ${motion.blur.backdrop};`,
  ].join("\n  ");
}

export function themeSelector(theme: Theme): string {
  return `:root[data-kelir-theme="${theme}"]`;
}