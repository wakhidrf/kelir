// createCss (builds the shared `css` token object) + the `css` singleton.
// Split out of kelir-variants.ts (SRP, <= 100 lines); the kelir-variants.ts
// barrel re-exports them. Behavior is unchanged.

import { layout } from "./kelir-layout";
import type { KelirMotionTokens } from "./kelir-motion";
import { easeMotion } from "./kelir-motion";
import { buildMotionTokens, buildTypographyTokens } from "./kelir-css-sections";
import type {
  KelirRounded,
  KelirShadows,
  KelirVariants,
} from "./kelir-variants-types";
import { rounded, shadows, variants } from "./kelir-variant-values";

const color = (name: string, fallback: string) =>
  `var(--color-${name}, ${fallback})`;
const shadow = (name: string, fallback: string) =>
  `var(--shadow-${name}, ${fallback})`;

export function createCss(
  variants: KelirVariants,
  shadows: KelirShadows,
  themeRounded: KelirRounded = rounded,
  motion: KelirMotionTokens = easeMotion,
) {
  return {
    colors: {
      background: color("background", variants.background),
      // Opaque canvas per theme (background may be a gradient) — for elements
      // that must stay readable across all themes (e.g. the trigger Sidebar edge tab).
      baseBackground: color("background-base", variants.baseBackground),
      surface: color("surface", variants.surface),
      textPrimary: color("text-primary", variants.textPrimary),
      textSecondary: color("text-secondary", variants.textSecondary),
      primary: color("primary", variants.primary),
      secondary: color("secondary", variants.secondary),
      tertiary: color("tertiary", variants.tertiary),
      neutral: color("neutral", variants.neutral),
    },
    on: {
      primary: color("on-primary", variants.onPrimary),
      secondary: color("on-secondary", variants.onSecondary),
      destructive: color("on-destructive", variants.onDestructive),
    },
    destructive: color("destructive", variants.destructive),
    border: {
      light: color("border-light", variants.borderLight),
      medium: color("border-medium", variants.borderMedium),
      strong: color("border-strong", variants.borderStrong),
    },
    divider: color("divider", variants.dividerDark),
    track: color("track", variants.trackDark),
    radius: {
      sm: `var(--radius-sm, ${themeRounded.sm})`,
      md: `var(--radius-md, ${themeRounded.md})`,
      lg: `var(--radius-lg, ${themeRounded.lg})`,
      // Roles (ISSUE-006): components use role tokens, the raw scale only in
      // theme definitions. Default = current values (zero visual change).
      button: `var(--radius-button, var(--radius-sm, ${themeRounded.sm}))`,
      card: `var(--radius-card, var(--radius-sm, ${themeRounded.sm}))`,
      surface: `var(--radius-surface, var(--radius-sm, ${themeRounded.sm}))`,
      prominent: `var(--radius-prominent, var(--radius-md, ${themeRounded.md}))`,
    },
    control: {
      padding: "var(--control-padding, 12px)",
      radius: `var(--control-radius, ${themeRounded.sm})`,
      background: "var(--control-background, var(--color-primary, #8A8F98))",
      minWidth: "var(--control-min-width, 224px)",
    },
    focusRing: {
      width: "var(--focus-ring-width, 2px)",
      offset: "var(--focus-ring-offset, 2px)",
      color: "var(--focus-ring-color, transparent)",
    },
    shadows: {
      card: shadow("card", shadows.card),
      convex: shadow("convex", shadows.convex),
      concave: shadow("concave", shadows.concave),
    },
    layout,
    motion: buildMotionTokens(motion),
    typography: buildTypographyTokens(),
  } as const;
}

export const css = createCss(variants, shadows);