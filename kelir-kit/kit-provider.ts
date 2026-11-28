import type * as React from "react";

// Global contexts & states
export type Theme =
  | "aurora-ui"
  | "claymorphism"
  | "dimensional-layering"
  | "editorial-contemporaneo"
  | "edtech-plataforma"
  | "flat-educacional"
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

// How the selected theme is persisted between visits.
//  - "cookie" (default): server-driven. The consumer root layout reads the
//    `kelir_theme` cookie and renders the saved theme onto <html> on the server,
//    so the first SSR paint is already themed (no flash, no client script). The
//    cost: the layout must `await cookies()`, which makes every route dynamic.
//  - "client": localStorage + a blocking inline script (à la next-themes). The
//    script stamps the stored theme onto <html> before first paint, and the
//    provider reads/writes localStorage — no cookie, so a consumer root layout
//    can stay static (SSG/CDN) while public pages still open on the right theme.
export type ThemeMode = "cookie" | "client";

// 0. KelirProvider — the only legitimate visual entry point (P1c STYLE.md §3c).
// Valid props are ONLY: `defaultTheme` (closed Theme union) + `children`.
// Runtime theme switching is not via extra props, but via the context
// `useKelir().setTheme` / `KelirSwitcher`. Any other visual prop = violation.
// Consumer brand font (identity, not layout). Two forms:
//  - string: a family name the host already loads (e.g. "Vermin Vibes Out Of
//    Ink"). The kit only installs --kelir-font-brand.
//  - BrandFontFace: a self-hosted face. The kit emits the @font-face rule and
//    preloads the first file, so the family actually resolves without consumer
//    CSS (issue #138). Structurally identical to the kit's internal FontFace.
export interface BrandFontFace {
  /** CSS font-family, quoted (e.g. '"Bebas Neue"'). */
  family: string;
  /** One entry per file; the first is the one a preload hints at. */
  files: { src: string; weight: string }[];
}

export interface KelirProviderProps {
  children: React.ReactNode;
  /** Consumer-provided default theme — for this app the theme cookie already
   *  resolved on the server, so the first render matches the persisted choice
   *  and there is no flash. */
  defaultTheme: Theme;
  // Consumer brand font: a family name, or a self-hosted face the kit installs
  // (@font-face + preload) so `Typography font="brand"` resolves without
  // consumer CSS. Values are sanitized of ; { } < >.
  brandFont?: string | BrandFontFace;
  // Persistence strategy: "cookie" (default) for a server-rendered theme with no
  // flash, or "client" to persist in localStorage so a static consumer layout
  // need not `await cookies()`. Runtime switching stays via `useKelir().setTheme`.
  themeMode?: ThemeMode;
  // Brand identity colors (two fixed slots, not free-form values): the kit sets
  // --kelir-brand-accent/--kelir-brand-ink for `Typography
  // tone="brand-accent"|"brand-ink"` - brand text that does NOT follow the theme (e.g.
  // two words in a title). Values are sanitized of ; { } < >.
  brandColors?: { accent: string; ink: string };
}