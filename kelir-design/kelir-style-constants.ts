// Theme attribute + cookie constants and the pre-ready hiding CSS. Split out of
// kelir-styles.ts (SRP, <= 100 lines); the kelir-styles.ts barrel re-exports
// them. Names and values are unchanged.

export const THEME_ATTRIBUTE = "data-kelir-theme";

// When this is "false" (server default until KelirProvider resolves the theme),
// the page stays at the browser default: no themed background/canvas and no
// theme text colors. KelirProvider flips it to "true" right before the first
// paint once the persisted theme has been read, so nothing themed is shown
// until that moment.
export const THEME_READY_ATTRIBUTE = "data-kelir-ready";

// Minimal hiding rules for the pre-resolution state. Rendered by the consumer
// root layout as the first <body> child (before any provider content streams)
// so the server default is never painted; KelirProvider keeps `data-kelir-ready`
// on <html> in sync and also re-includes these rules through kelirStyleCss.
export const hideBeforeReadyCss = `
  html[data-kelir-ready="false"] body {
    visibility: hidden !important;
    background-color: #ffffff;
    color: #000000;
  }
  html[data-kelir-ready="false"] body::before,
  html[data-kelir-ready="false"] body::after {
    opacity: 0;
  }
`;

// Theme persistence is server-side via cookie: layout.tsx reads the cookie and
// renders the saved theme on <html>, so the very first SSR HTML is already
// themed — no flash, no client-side inline script and no localStorage. The
// client only applies the theme instantly (attribute) and persists back through
// a Server Action. Name is URL-safe (no ":").
export const THEME_COOKIE = "kelir_theme";

// Client-mode (themeMode="client") persistence key. Lives in localStorage so a
// consumer root layout never reads a cookie and can stay static. Same string as
// the cookie name so the two modes share one vocabulary.
export const THEME_STORAGE_KEY = "kelir_theme";

// Blocking inline script for client mode (next-themes style). Rendered by
// KelirProvider as the first child so the browser runs it while parsing <body>,
// before the themed content below it: it reads the stored theme and stamps it
// onto <html data-kelir-theme>, so the first paint is already themed — no flash
// and no cookie. Safe to inline: the value is JSON-encoded and unknown keys are
// ignored by the attribute (they simply match no theme selector).
export function clientThemeScript(): string {
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY,
  )});if(t){document.documentElement.setAttribute(${JSON.stringify(
    THEME_ATTRIBUTE,
  )},t)}}catch(e){}})();`;
}
