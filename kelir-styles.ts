// Generates the theme token CSS variables (colors, radius, shadows) plus the
// per-theme font stacks, entirely inside Kelir. KelirProvider injects this as
// a <style> tag so consumers do not need any token CSS of their own.
//
// Selectors mirror the theme attribute set by next-themes' pre-hydration
// script (data-kelir-theme), so the saved theme renders with zero flash on
// refresh. The default theme (no attribute) is neumorphism.

import { themeRegistry } from "./kelir-registry";
import type { Theme } from "./kelir-types";
import { scrollbarCss } from "./kelir-variants";

export const DEFAULT_THEME: Theme = "neumorphism";

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
  neumorphism: {
    active: '"Product Sans", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  "kawaii-sweet-pastel": {
    active: '"Fredoka", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  glassmorphism: {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
};

const FONT_URLS: Record<Theme, string> = {
  neumorphism: "https://fonts.cdnfonts.com/css/product-sans",
  "kawaii-sweet-pastel": "https://fonts.cdnfonts.com/css/fredoka",
  glassmorphism: "https://fonts.cdnfonts.com/css/jetbrains-mono",
};

const MONO_FONT_URL = "https://fonts.cdnfonts.com/css/jetbrains-mono";

// Native color scheme: matches whether the theme uses light or dark text so
// OS-rendered surfaces (native <select> dropdown, scrollbars, overlays) get the
// correct panel color and don't render white-on-white / dark-on-dark.
const SCHEMES: Record<Theme, "light" | "dark"> = {
  neumorphism: "light",
  "kawaii-sweet-pastel": "light",
  glassmorphism: "dark",
};

function themeVars(theme: Theme): string {
  const tokens = themeRegistry[theme].tokens;
  const colors = tokens.colors;
  const rounded = tokens.rounded;
  const shadows = tokens.shadows;
  const fonts = FONTS[theme] ?? FONTS[DEFAULT_THEME];

  return [
    `--color-primary: ${colors.primary};`,
    `--color-secondary: ${colors.secondary};`,
    `--color-tertiary: ${colors.tertiary};`,
    `--color-background: ${colors.background};`,
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
    `--shadow-convex: ${shadows.convex};`,
    `--shadow-concave: ${shadows.concave};`,
    `--shadow-card: ${shadows.card};`,
    `--kelir-font-active: ${fonts.active};`,
    `--kelir-font-mono: ${fonts.mono};`,
    `--kelir-color-scheme: ${SCHEMES[theme] ?? "light"};`,
  ].join("\n  ");
}

function themeSelector(theme: Theme): string {
  return theme === DEFAULT_THEME
    ? ":root"
    : `:root[data-kelir-theme="${theme}"]`;
}

// Base stylesheet that makes Kelir the single source of appearance. The
// page-level (body) colors and font follow the active theme's CSS variables,
// so the whole page restyles instantly when the theme changes.
const baseCss = `
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
    background: var(--color-background, #e8e8e8);
    color: var(--color-text-primary, #333333);
    font-family: var(--kelir-font-active, sans-serif);
    color-scheme: var(--kelir-color-scheme, light);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
`;

export function kelirStyleCss(): string {
  const themes = Object.keys(themeRegistry) as Theme[];
  const blocks = themes.map(
    (theme) => `${themeSelector(theme)} {\n  ${themeVars(theme)}\n}`,
  );
  return `${baseCss}\n\n${blocks.join("\n\n")}\n\n${scrollbarCss}`;
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
