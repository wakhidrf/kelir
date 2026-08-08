// Generates the theme token CSS variables (colors, radius, shadows) plus the
// per-theme font stacks, entirely inside Kelir. KelirProvider injects this as
// a <style> tag so consumers do not need any token CSS of their own.
//
// Selectors mirror the theme attribute set by next-themes' pre-hydration
// script (data-kelir-theme), so the saved theme renders with zero flash on
// refresh. There is no hardcoded default theme here: the consumer supplies the
// default (from its own persisted cookie) via KelirProvider, and this module
// merely emits a selector per registered theme.

import { layoutVars } from "./kelir-layout";
import { motionFor } from "./kelir-motion";
import { themeRegistry } from "./kelir-registry";
import type { Theme } from "./kelir-types";
import { typographyVars } from "./kelir-typography";
import { scrollbarCss } from "./kelir-variants";

export const THEME_ATTRIBUTE = "data-kelir-theme";

// Server-side source of truth for the theme so the initial HTML (and thus the
// NativeSelect label) is already correct on refresh — same pattern as the
// language cookie. URL-safe name only (js-cookie would encode ":").
export const THEME_COOKIE = "kelir_theme";

interface ThemeFonts {
  active: string;
  mono: string;
}

// Font stacks per theme. The font files themselves are loaded (render-blocking)
// via <link> tags rendered by KelirProvider, so no fallback font flashes.
const FONTS: Record<Theme, ThemeFonts> = {
  "aurora-ui": {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  neumorphism: {
    active: '"Product Sans", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  glassmorphism: {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  "liquid-glass": {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  "spatial-ui": {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  claymorphism: {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  "dimensional-layering": {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  "editorial-contemporaneo": {
    active: '"Playfair Display", serif', // DESIGN typography (Playfair Display)
    mono: '"JetBrains Mono", monospace',
  },
  "edtech-plataforma": {
    active: '"Poppins", sans-serif', // DESIGN typography (Poppins)
    mono: '"JetBrains Mono", monospace',
  },
  "futuristic-glassmorphism": {
    active: '"Exo 2", sans-serif', // DESIGN typography (Exo 2)
    mono: '"JetBrains Mono", monospace',
  },
  skeuomorphism: {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
};

const FONT_URLS: Record<Theme, string> = {
  "aurora-ui": "https://fonts.cdnfonts.com/css/jetbrains-mono",
  neumorphism: "https://fonts.cdnfonts.com/css/product-sans",
  glassmorphism: "https://fonts.cdnfonts.com/css/jetbrains-mono",
  "liquid-glass": "https://fonts.cdnfonts.com/css/jetbrains-mono",
  "spatial-ui": "https://fonts.cdnfonts.com/css/jetbrains-mono",
  claymorphism: "https://fonts.cdnfonts.com/css/jetbrains-mono",
  "dimensional-layering": "https://fonts.cdnfonts.com/css/jetbrains-mono",
  "editorial-contemporaneo": "https://fonts.cdnfonts.com/css/playfair-display",
  "edtech-plataforma": "https://fonts.cdnfonts.com/css/poppins",
  "futuristic-glassmorphism": "https://fonts.cdnfonts.com/css/exo-2",
  skeuomorphism: "https://fonts.cdnfonts.com/css/jetbrains-mono",
};

const MONO_FONT_URL = "https://fonts.cdnfonts.com/css/jetbrains-mono";

// Native color scheme: matches whether the theme uses light or dark text so
// OS-rendered surfaces (native <select> dropdown, scrollbars, overlays) get the
// correct panel color and don't render white-on-white / dark-on-dark.
const SCHEMES: Record<Theme, "light" | "dark"> = {
  "aurora-ui": "dark",
  neumorphism: "light",
  glassmorphism: "dark",
  "liquid-glass": "dark",
  "spatial-ui": "light",
  claymorphism: "light",
  "dimensional-layering": "light",
  "editorial-contemporaneo": "light",
  "edtech-plataforma": "light", // DESIGN light only
  "futuristic-glassmorphism": "dark",
  skeuomorphism: "dark",
};

function themeVars(theme: Theme): string {
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

function themeSelector(theme: Theme): string {
  return `:root[data-kelir-theme="${theme}"]`;
}

// Base stylesheet that makes Kelir the single source of appearance. The
// page-level (body) colors and font follow the active theme's CSS variables,
// so the whole page restyles instantly when the theme changes.
const baseCss = `
  :root {
    ${layoutVars}
    ${typographyVars}
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html {
    height: 100%;
  }
  html, body {
    max-width: 100vw;
    overflow-x: hidden;
  }
  body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background-base, #f5f6f7);
    color: var(--color-text-primary, #1f2328);
    font-family: var(--kelir-font-active, sans-serif);
    color-scheme: var(--kelir-color-scheme, light);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: var(--kelir-flow-opacity, 0);
    background:
      radial-gradient(600px 500px at 20% 30%, rgba(0, 128, 255, 0.5) 0%, transparent 70%),
      radial-gradient(700px 600px at 80% 70%, rgba(255, 20, 147, 0.35) 0%, transparent 70%),
      radial-gradient(500px 500px at 45% 55%, rgba(0, 255, 255, 0.25) 0%, transparent 70%);
    background-size: 200% 200%;
    animation: var(--kelir-flow-anim, none);
  }
  /* Theme canvas is locked to the viewport (fixed layer) instead of being
     painted over the full scrollable height. Keeps the gradient computed
     against viewport size only, so long pages no longer stretch, relocate or
     band the gradient ("belang-belang"). Below the fold, body's solid
     --color-background-base takes over seamlessly. */
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -2;
    pointer-events: none;
    background: var(--color-background, transparent);
    background-repeat: no-repeat;
  }
  h1, h2 {
    text-shadow: var(--kelir-chroma, none);
  }
  a {
    color: inherit;
    text-decoration: none;
  }
`;

export function kelirStyleCss(): string {
  const keyframes = `
@keyframes kelir-aurora-flow {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}
`;
  const themes = Object.keys(themeRegistry) as Theme[];
  const blocks = themes.map(
    (theme) => `${themeSelector(theme)} {\n  ${themeVars(theme)}\n}`,
  );
  return `${baseCss}\n${keyframes}\n${blocks.join("\n\n")}\n\n${scrollbarCss}`;
}

// Font stylesheets rendered by KelirProvider so they load before the content
// paints (render-blocking) and are cached for instant theme/font switching.
export function fontLinks(): Array<{ href: string }> {
  const links = new Map<string, true>();
  links.set(MONO_FONT_URL, true);
  for (const theme of Object.keys(themeRegistry) as Theme[]) {
    const url = FONT_URLS[theme];
    if (url) links.set(url, true);
  }
  return [...links.keys()].map((href) => ({ href }));
}
