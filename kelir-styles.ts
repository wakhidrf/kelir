// Generates the theme token CSS variables (colors, radius, shadows) plus the
// per-theme font stacks, entirely inside Kelir. KelirProvider injects this as
// a <style> tag so consumers do not need any token CSS of their own.
//
// Selectors mirror the theme attribute (data-kelir-theme): the server lays the
// attribute onto <html> when no switcher is used (server-driven theme), and
// KelirProvider writes it when the switcher adopts a persisted theme. There is
// no hardcoded default theme here: the consumer supplies the default via
// KelirProvider, and this module merely emits a selector per registered theme.
//
// Barrel: constants in ./kelir-style-constants, font/scheme tables in
// ./kelir-theme-fonts, per-theme vars in ./kelir-theme-vars, base sheet in
// ./kelir-base-css. Names of the public exports are unchanged.

import { baseCss } from "./kelir-base-css";
import { themeRegistry } from "./kelir-registry";
import type { Theme } from "./kelir-types";
import { FONT_URLS, MONO_FONT_URL } from "./kelir-theme-fonts";
import { themeSelector, themeVars } from "./kelir-theme-vars";
import { scrollbarCss } from "./kelir-variants";

export {
  hideBeforeReadyCss,
  THEME_ATTRIBUTE,
  THEME_COOKIE,
  THEME_READY_ATTRIBUTE,
} from "./kelir-style-constants";

export function kelirStyleCss(): string {
  const keyframes = `
@keyframes kelir-aurora-flow {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}
/* The kit's own pulse rhythm for the LoadingOverlay card: consistent across all
   themes, no consumer prop needed (kit decision). */
@keyframes kelir-loading-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
`;
  const themes = Object.keys(themeRegistry) as Theme[];
  const blocks = themes.map(
    (theme) => `${themeSelector(theme)} {\n  ${themeVars(theme)}\n}`,
  );
  // The whole kit stylesheet is locked inside @layer kelir (§3b STYLE.md) so
  // priority order is deterministic. v4 CORRECTION that was wrong: a layer
  // alone is NOT enough (unlayered CSS beats layered CSS) — the critical
  // declarations use !important inside the layer, which beats unlayered normal
  // CSS.
  const inner = `${baseCss}\n${keyframes}\n${blocks.join("\n\n")}\n\n${scrollbarCss}`;
  return `@layer kelir {\n${inner}\n}`;
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