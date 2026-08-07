// Single source of truth for layout tokens, per the shared `## Layout` section
// in every design.md (all four themes declare identical values).
//
// Layout is theme-agnostic: spacing rhythm (0.5rem base unit), page container,
// section gaps, mobile breakpoint and the z-index contract are the same across
// neumorphism/glassmorphism/claymorphism/skeuomorphism. KelirProvider emits
// these as CSS variables on `:root`; kelir-components reference them via
// `css.layout` (resolved through `import { css } from "../kelir-variants"`).

export interface KelirSpace {
  /** 4px */
  xs: string;
  /** 8px (base unit) */
  sm: string;
  /** 12px */
  md: string;
  /** 16px */
  lg: string;
  /** 24px */
  xl: string;
  /** 32px */
  "2xl": string;
  /** 48px */
  "3xl": string;
  /** 64px */
  "4xl": string;
}

export interface KelirLayoutTokens {
  space: KelirSpace;
  container: { maxWidth: string; sidePadding: string };
  sectionGap: string;
  breakpoints: { heroCollapse: string };
  zIndex: {
    base: string;
    sticky: string;
    overlay: string;
    modal: string;
    toast: string;
  };
}

// Scale rooted at the 0.5rem (8px) base unit from design.md. Defined once here
// and mirrored as CSS variables so consumers can also use var(--space-*) in raw
// inline styles / MUI sx when the `css` object is not in scope.
export const layout: KelirLayoutTokens = {
  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    "4xl": "4rem",
  },
  container: {
    maxWidth: "1280px",
    sidePadding: "1.5rem",
  },
  sectionGap: "clamp(4rem, 8vw, 8rem)",
  breakpoints: {
    heroCollapse: "768px",
  },
  zIndex: {
    base: "0",
    sticky: "100",
    overlay: "200",
    modal: "300",
    toast: "500",
  },
} as const;

// CSS variables for the layout tokens, installed on `:root` so they are usable
// from any inline style / sx without importing the JS object.
export const layoutVars: string =
  `--space-xs: ${layout.space.xs};\n` +
  `--space-sm: ${layout.space.sm};\n` +
  `--space-md: ${layout.space.md};\n` +
  `--space-lg: ${layout.space.lg};\n` +
  `--space-xl: ${layout.space.xl};\n` +
  `--space-2xl: ${layout.space["2xl"]};\n` +
  `--space-3xl: ${layout.space["3xl"]};\n` +
  `--space-4xl: ${layout.space["4xl"]};\n` +
  `--layout-container-max: ${layout.container.maxWidth};\n` +
  `--layout-container-pad: ${layout.container.sidePadding};\n` +
  `--layout-section-gap: ${layout.sectionGap};\n` +
  `--layout-hero-collapse: ${layout.breakpoints.heroCollapse};\n` +
  `--z-base: ${layout.zIndex.base};\n` +
  `--z-sticky: ${layout.zIndex.sticky};\n` +
  `--z-overlay: ${layout.zIndex.overlay};\n` +
  `--z-modal: ${layout.zIndex.modal};\n` +
  `--z-toast: ${layout.zIndex.toast};\n`;

export type LayoutSpaceName = keyof KelirSpace;
