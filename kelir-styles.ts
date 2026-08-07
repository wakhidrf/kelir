// Generates the theme token CSS variables (colors, radius, shadows) plus the
// per-theme font stacks, entirely inside Kelir. KelirProvider injects this as
// a <style> tag so consumers do not need any token CSS of their own.
//
// Selectors mirror the theme attribute set by next-themes' pre-hydration
// script (data-kelir-theme), so the saved theme renders with zero flash on
// refresh. The default theme (no attribute) is neumorphism.

import { layoutVars } from "./kelir-layout";
import { motionFor } from "./kelir-motion";
import { themeRegistry } from "./kelir-registry";
import type { Theme } from "./kelir-types";
import { typographyVars } from "./kelir-typography";
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
  glassmorphism: {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  claymorphism: {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  skeuomorphism: {
    active: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
};

const FONT_URLS: Record<Theme, string> = {
  neumorphism: "https://fonts.cdnfonts.com/css/product-sans",
  glassmorphism: "https://fonts.cdnfonts.com/css/jetbrains-mono",
  claymorphism: "https://fonts.cdnfonts.com/css/jetbrains-mono",
  skeuomorphism: "https://fonts.cdnfonts.com/css/jetbrains-mono",
};

const MONO_FONT_URL = "https://fonts.cdnfonts.com/css/jetbrains-mono";

// Native color scheme: matches whether the theme uses light or dark text so
// OS-rendered surfaces (native <select> dropdown, scrollbars, overlays) get the
// correct panel color and don't render white-on-white / dark-on-dark.
const SCHEMES: Record<Theme, "light" | "dark"> = {
  neumorphism: "light",
  glassmorphism: "dark",
  claymorphism: "light",
  skeuomorphism: "dark",
};

function themeVars(theme: Theme): string {
  const tokens = themeRegistry[theme].tokens;
  const colors = tokens.colors;
  const rounded = tokens.rounded;
  const shadows = tokens.shadows;
  const fonts = FONTS[theme] ?? FONTS[DEFAULT_THEME];
  const motion = motionFor(theme);
  const control = tokens.components?.buttonPrimary;

  return [
    `--color-primary: ${colors.primary};`,
    `--color-secondary: ${colors.secondary};`,
    `--color-tertiary: ${colors.tertiary};`,
    `--color-neutral: ${colors.neutral};`,
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
    `--control-padding: ${control?.padding ?? "12px"};`,
    `--control-radius: ${control?.rounded ?? rounded.sm};`,
    `--focus-ring-width: 2px;`,
    `--focus-ring-offset: 2px;`,
    `--focus-ring-color: ${colors.primary};`,
    `--shadow-convex: ${shadows.convex};`,
    `--shadow-concave: ${shadows.concave};`,
    `--shadow-card: ${shadows.card};`,
    `--kelir-font-active: ${fonts.active};`,
    `--kelir-font-mono: ${fonts.mono};`,
    `--kelir-color-scheme: ${SCHEMES[theme] ?? "light"};`,
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
  return theme === DEFAULT_THEME
    ? ":root"
    : `:root[data-kelir-theme="${theme}"]`;
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
