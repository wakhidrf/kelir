import { layout } from "./kelir-layout";
import type { KelirMotionTokens } from "./kelir-motion";
import { easeMotion } from "./kelir-motion";
import { typography as baseTypography } from "./kelir-typography";

export interface KelirVariants {
  // Warna inti dari DESIGN.md
  primary: string;
  secondary: string;
  tertiary: string;
  neutral: string;
  // Warna turunan semantik (nilai bebas per tema, nama key fix)
  textPrimary: string;
  textSecondary: string;
  onPrimary: string;
  onSecondary: string;
  onDestructive: string;
  destructive: string;
  background: string;
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

const color = (name: string, fallback: string) =>
  `var(--color-${name}, ${fallback})`;
const shadow = (name: string, fallback: string) =>
  `var(--shadow-${name}, ${fallback})`;

export interface KelirRounded {
  sm: string;
  md: string;
  lg: string;
}

// Neutral base rounded scale (theme-agnostic fallback).
export const rounded: KelirRounded = {
  sm: "8px",
  md: "16px",
  lg: "24px",
} as const;

export function createCss(
  variants: KelirVariants,
  shadows: KelirShadows,
  themeRounded: KelirRounded = rounded,
  motion: KelirMotionTokens = easeMotion,
) {
  return {
    colors: {
      background: color("background", variants.background),
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
    },
    control: {
      padding: "var(--control-padding, 12px)",
      radius: `var(--control-radius, ${themeRounded.sm})`,
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
    motion: {
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
    },
    typography: {
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
    },
  } as const;
}

// ===== Neutral base fallbacks =====
// Values used ONLY as the var() fallback inside kelir-components so a component
// still has sensible colors before/without a theme's CSS variables. They are
// deliberately theme-agnostic — never tied to any single theme — so consumers
// cannot accidentally render a specific theme when the attribute is missing.
export const variants = {
  // Warna inti netral (bukan tema mana pun)
  primary: "#8A8F98", // neutral gray (accent fallback)
  secondary: "#A6ABB3", // lighter gray
  tertiary: "#C4C8CE", // light gray
  neutral: "#3C4146", // dark gray (text / neutral)
  // Warna turunan semantik (nilai netral)
  textPrimary: "#1F2328", // near-black (primary text)
  textSecondary: "#555B63", // muted gray (secondary text)
  onPrimary: "#FFFFFF", // white (text on primary)
  onSecondary: "#FFFFFF", // white (text on secondary)
  onDestructive: "#FFFFFF", // white (text on destructive)
  destructive: "#B3261E", // neutral red (destructive background)
  background: "#F5F6F7", // neutral light canvas
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

export const shadows = {
  card: "0 1px 3px rgba(0, 0, 0, 0.12)",
  convex: "0 2px 8px rgba(0, 0, 0, 0.12)",
  concave: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
} as const;

export const css = createCss(variants, shadows);

// Scrollbar bertema: class statis + CSS yang warnanya mengikuti token tema
// (runtime diisi KelirProvider dari kelir-themes lewat CSS variables).
export const scrollbarClass = "kelir-scrollbar";

export const scrollbarCss = `
  .${scrollbarClass} {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, ${css.colors.textSecondary} 45%, transparent) ${css.track};
  }
  .${scrollbarClass}::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  .${scrollbarClass}::-webkit-scrollbar-track {
    background: ${css.track};
    border-radius: var(--radius-sm, ${rounded.sm});
  }
  .${scrollbarClass}::-webkit-scrollbar-thumb {
    background: ${css.track};
    border: 2px solid transparent;
    background-clip: padding-box;
    border-radius: var(--radius-sm, ${rounded.sm});
  }
  @supports (color: color-mix(in srgb, red 50%, blue)) {
    .${scrollbarClass}::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, ${css.colors.textSecondary} 45%, transparent);
    }
  }
  .${scrollbarClass}::-webkit-scrollbar-thumb:hover {
    background: ${css.colors.primary};
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;
