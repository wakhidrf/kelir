import type * as React from "react";

// Global contexts & states
export type Theme =
  | "aurora-ui"
  | "claymorphism"
  | "dimensional-layering"
  | "editorial-contemporaneo"
  | "edtech-plataforma"
  | "futuristic-glassmorphism"
  | "glassmorphism"
  | "liquid-glass"
  | "neumorphism"
  | "skeuomorphism"
  | "spatial-ui";

export interface KelirContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { slug: Theme; label: string }[];
  /** Mounting/unmounting signals from KelirSwitcher (or any theme picker UI).
   *  When the counter is 0 (no switcher on the page) the provider removes the
   *  persisted theme cookie, keeping a shared origin (e.g. localhost:3000 used
   *  by several projects) free of leaked theme preferences. */
  registerSwitcher: () => void;
  unregisterSwitcher: () => void;
}

// 0. KelirProvider — the only legitimate visual entry point (P1c STYLE.md §3c).
// Valid props are ONLY: `defaultTheme` (closed Theme union) + `children`.
// Runtime theme switching is not via extra props, but via the context
// `useKelir().setTheme` / `KelirSwitcher`. Any other visual prop = violation.
export interface KelirProviderProps {
  children: React.ReactNode;
  /** Consumer-provided default theme — for this app the theme cookie already
   *  resolved on the server, so the first render matches the persisted choice
   *  and there is no flash. */
  defaultTheme: Theme;
  // Consumer brand font (font family name, e.g. "Vermin Vibes Out Of
  // Ink"). The kit applies it as --kelir-font-brand for
  // `Typography font="brand"` - consumers do not write their own CSS.
  brandFont?: string;
  // Brand identity colors (two fixed slots, not free-form values): the kit sets
  // --kelir-brand-accent/--kelir-brand-ink for `Typography
  // tone="brand-accent"|"brand-ink"` - brand text that does NOT follow the theme (e.g.
  // two words in a title). Values are sanitized of ; { } < >.
  brandColors?: { accent: string; ink: string };
}