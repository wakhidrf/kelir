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

// Base / default theme (neumorphism) rounded scale.
export const rounded: KelirRounded = {
  sm: "14px",
  md: "28px",
  lg: "42px",
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

// ===== Base / default theme (neumorphism) =====
// Nilai default dipakai kelir-components sebagai referensi var() bersama;
// runtime-nya selalu di-override oleh KelirProvider lewat CSS variables.
// Warna inti mengikuti DESIGN.md (primary/secondary/tertiary/neutral) dan
// sisanya adalah turunan semantik neumorphism.
export const variants = {
  // Warna inti dari DESIGN.md
  primary: "#C8E0F4", // Soft Blue
  secondary: "#F5E0E8", // Soft Pink
  tertiary: "#E8E8E8", // Soft Grey
  neutral: "#2C4A63", // Deep Blue (neutral / text)
  // Warna turunan semantik
  textPrimary: "#333333", // Charcoal (primary text)
  textSecondary: "#666666", // Slate (secondary text)
  onPrimary: "#2C4A63", // Deep Blue (text on primary)
  onSecondary: "#632C41", // Deep Pink (text on secondary)
  onDestructive: "#900C3F", // Deep Red (text on destructive)
  destructive: "#FFCCD5", // Soft Red (destructive background)
  background: "#E8E8E8", // Neumorphic background
  surface: "#E8E8E8", // Neumorphic surface (blend with background)
  borderLight: "rgba(255, 255, 255, 0.4)",
  borderMedium: "rgba(255, 255, 255, 0.5)",
  borderStrong: "rgba(255, 255, 255, 0.6)",
  dividerDark: "rgba(0, 0, 0, 0.05)",
  trackDark: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.08)",
  shadowLight: "rgba(255, 255, 255, 0.9)",
} as const;

export type VariantName = keyof typeof variants;

export const shadows = {
  card: "3px 3px 10px rgba(0, 0, 0, 0.05), -3px -3px 10px rgba(255, 255, 255, 0.8)",
  convex: `5px 5px 15px ${variants.shadowDark}, -5px -5px 15px ${variants.shadowLight}`,
  concave: `inset 5px 5px 10px ${variants.shadowDark}, inset -5px -5px 10px ${variants.shadowLight}`,
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
