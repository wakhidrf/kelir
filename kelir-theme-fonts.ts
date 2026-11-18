// Per-theme font stacks, stylesheet URLs and native color scheme. Split out of
// kelir-styles.ts (SRP, <= 100 lines). The kelir-styles.ts barrel consumes
// these to emit per-theme CSS variables and render font <link>s.

import type { Theme } from "./kelir-types";

interface ThemeFonts {
  active: string;
  mono: string;
}

// Font stacks per theme. The font files themselves are loaded (render-blocking)
// via <link> tags rendered by KelirProvider, so no fallback font flashes.
export const FONTS: Record<Theme, ThemeFonts> = {
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

export const FONT_URLS: Record<Theme, string> = {
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

export const MONO_FONT_URL = "https://fonts.cdnfonts.com/css/jetbrains-mono";

// Native color scheme: matches whether the theme uses light or dark text so
// OS-rendered surfaces (native <select> dropdown, scrollbars, overlays) get the
// correct panel color and don't render white-on-white / dark-on-dark.
export const SCHEMES: Record<Theme, "light" | "dark"> = {
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