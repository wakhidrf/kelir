export interface KelirVariants {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  quinary: string;
  senary: string;
  septenary: string;
  octonary: string;
  nonary: string;
  denary: string;
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
) {
  return {
    colors: {
      background: color("background", variants.background),
      surface: color("surface", variants.surface),
      textPrimary: color("text-primary", variants.octonary),
      textSecondary: color("text-secondary", variants.nonary),
      primary: color("primary", variants.primary),
      secondary: color("secondary", variants.secondary),
      tertiary: color("tertiary", variants.tertiary),
    },
    on: {
      primary: color("on-primary", variants.quaternary),
      secondary: color("on-secondary", variants.quinary),
      destructive: color("on-destructive", variants.senary),
    },
    destructive: color("destructive", variants.septenary),
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
    shadows: {
      card: shadow("card", shadows.card),
      convex: shadow("convex", shadows.convex),
      concave: shadow("concave", shadows.concave),
    },
  } as const;
}

// ===== Base / default theme (neumorphism) =====
// Nilai default dipakai kelir-components sebagai referensi var() bersama;
// runtime-nya selalu di-override oleh KelirProvider lewat CSS variables.
export const variants = {
  // Palet inti (10 warna, fix antar tema)
  primary: "#C8E0F4", // Soft Blue
  secondary: "#F5E0E8", // Soft Pink
  tertiary: "#E8E8E8", // Soft Grey
  quaternary: "#2C4A63", // Deep Blue (text on primary)
  quinary: "#632C41", // Deep Pink (text on secondary)
  senary: "#900C3F", // Deep Red (text on destructive)
  septenary: "#FFCCD5", // Soft Red (destructive background)
  octonary: "#333333", // Charcoal (primary text)
  nonary: "#666666", // Slate (secondary text)
  denary: "#FFFFFF", // White (light shadow / highlight)
  // Warna turunan (nilai bebas per tema, nama key fix)
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
