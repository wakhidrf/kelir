// Per-theme font stacks plus the families each theme pulls in. Split out of
// kelir-styles.ts (SRP, <= 100 lines); the @font-face table itself lives in
// ./kelir-theme-font-faces, and kelir-styles.ts composes both into the sheet.
//
// The stacks come from kelir-dev/design/<theme>.md. Every theme sets its mono
// face to JetBrains Mono; only four add a display face on top of it.

import type { FontKey } from "./kelir-theme-font-faces";
import type { Theme } from "../kelir-kit/kit-provider";

interface ThemeFonts {
  active: string;
  mono: string;
  /** Families this theme needs; drives @font-face emission and preload. */
  faces: FontKey[];
}

const SYSTEM =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const MONO = '"JetBrains Mono", monospace';
const MONO_ONLY: FontKey[] = ["jetbrains-mono"];

export const FONTS: Record<Theme, ThemeFonts> = {
  "aurora-ui": { active: SYSTEM, mono: MONO, faces: MONO_ONLY },
  neumorphism: { active: SYSTEM, mono: MONO, faces: MONO_ONLY },
  glassmorphism: { active: SYSTEM, mono: MONO, faces: MONO_ONLY },
  "liquid-glass": { active: SYSTEM, mono: MONO, faces: MONO_ONLY },
  "spatial-ui": { active: SYSTEM, mono: MONO, faces: MONO_ONLY },
  claymorphism: { active: SYSTEM, mono: MONO, faces: MONO_ONLY },
  "dimensional-layering": { active: SYSTEM, mono: MONO, faces: MONO_ONLY },
  "editorial-contemporaneo": {
    active: '"Playfair Display", serif',
    mono: MONO,
    faces: ["playfair-display", "jetbrains-mono"],
  },
  "edtech-plataforma": {
    active: '"Poppins", sans-serif',
    mono: MONO,
    faces: ["poppins", "jetbrains-mono"],
  },
  "futuristic-glassmorphism": {
    active: '"Exo 2", sans-serif',
    mono: MONO,
    faces: ["exo-2", "jetbrains-mono"],
  },
  skeuomorphism: { active: SYSTEM, mono: MONO, faces: MONO_ONLY },
};

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
