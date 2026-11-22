// Single source of truth for the extended typography scale, per the shared
// `## Typography` → `Scale:` list in every design.md. Like layout, the full
// scale (hero/h1/h2/body/small + line-height + measure) is identical across
// all four themes, so it lives here once and is emitted as CSS variables on
// `:root` by KelirProvider (see kelir-styles).
//
// The per-theme front-matter `typography` block (h1/bodyMd/labelCaps) still
// sets the font family + base weights; this module supplies the complete
// display->caption scale, body line-height and the max reading measure.

export interface KelirTypeScale {
  hero: string;
  heroSm: string;
  h1: string;
  h2: string;
  stat: string;
  body: string;
  small: string;
  label: string;
}

export interface KelirTypographyTokens {
  scale: KelirTypeScale;
  lineHeight: { body: string };
  letterSpacing: { hero: string };
  maxCh: { body: string };
  weights: {
    hero: number;
    h1: number;
    h2: number;
    stat: number;
    body: number;
    label: number;
  };
}

export const typography: KelirTypographyTokens = {
  scale: {
    hero: "clamp(2.6rem, 6vw, 4.5rem)",
    heroSm: "clamp(1.8rem, 9vw, 2.6rem)",
    h1: "2.25rem",
    h2: "1.5rem",
    stat: "1.875rem",
    body: "1rem",
    small: "0.875rem",
    label: "0.875rem",
  },
  lineHeight: {
    body: "1.6",
  },
  letterSpacing: {
    hero: "-1px",
  },
  maxCh: {
    body: "72ch",
  },
  weights: {
    hero: 800,
    h1: 700,
    h2: 600,
    stat: 800,
    body: 400,
    label: 500,
  },
} as const;

// CSS variables for the extended type scale, installed on `:root` so they are
// usable from any inline style / sx without importing the JS object.
export const typographyVars: string =
  `--type-hero: ${typography.scale.hero};\n` +
  `--type-hero-sm: ${typography.scale.heroSm};\n` +
  `--type-h1: ${typography.scale.h1};\n` +
  `--type-h2: ${typography.scale.h2};\n` +
  `--type-stat: ${typography.scale.stat};\n` +
  `--type-body: ${typography.scale.body};\n` +
  `--type-small: ${typography.scale.small};\n` +
  `--type-label: ${typography.scale.label};\n` +
  `--type-weight-hero: ${typography.weights.hero};\n` +
  `--type-weight-h1: ${typography.weights.h1};\n` +
  `--type-weight-h2: ${typography.weights.h2};\n` +
  `--type-weight-stat: ${typography.weights.stat};\n` +
  `--type-weight-body: ${typography.weights.body};\n` +
  `--type-weight-label: ${typography.weights.label};\n` +
  `--type-letterspacing-hero: ${typography.letterSpacing.hero};\n` +
  `--type-lineheight-body: ${typography.lineHeight.body};\n` +
  `--type-max-ch: ${typography.maxCh.body};\n`;
