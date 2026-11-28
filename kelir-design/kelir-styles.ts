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
// Barrel: constants in ./kelir-style-constants, font stacks in
// ./kelir-theme-fonts, @font-face files in ./kelir-theme-font-faces, per-theme
// vars in ./kelir-theme-vars, base sheet in ./kelir-base-css. Names of the
// public exports are unchanged.

import { baseCss } from "./kelir-base-css";
import { reducedMotionCss, skipLinkCss } from "./kelir-style-constants";
import { faceCss } from "./kelir-font-css";
import { themeRegistry } from "./kelir-registry";
import { FONT_FACES } from "./kelir-theme-font-faces";
import { FONTS } from "./kelir-theme-fonts";
import type { Theme } from "../kelir-kit/kit-provider";
import { themeSelector, themeVars } from "./kelir-theme-vars";
import { scrollbarCss } from "../kelir-kit/kit-scrollbar";

export {
  clientThemeScript,
  hideBeforeReadyCss,
  THEME_ATTRIBUTE,
  THEME_COOKIE,
  THEME_READY_ATTRIBUTE,
  THEME_STORAGE_KEY,
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
  const inner = `${baseCss}\n${keyframes}\n${blocks.join("\n\n")}\n\n${scrollbarCss}\n${skipLinkCss}\n${reducedMotionCss}`;
  // @font-face first, outside the layer: the browser discovers the files while
  // the (much larger) token sheet is still parsing.
  return `${fontFaceCss()}\n@layer kelir {\n${inner}\n}`;
}

// @font-face rules for every family a theme can use, pointing at the host's own
// origin. Declaring all of them costs nothing until a family is used: an
// unreferenced @font-face downloads no file.
export function fontFaceCss(): string {
  return Object.values(FONT_FACES).map(faceCss).join("\n");
}

// Preload hints for the active theme: the first file of each family it uses, so
// the text face and the mono face start downloading during HTML parse instead of
// after the token sheet lands. Remaining weights are declared by fontFaceCss()
// and fetched only when a rule actually uses them.
export function fontLinks(theme: Theme): Array<{ href: string }> {
  const hrefs = new Set<string>();
  for (const key of FONTS[theme].faces) {
    const file = FONT_FACES[key]?.files[0];
    if (file) hrefs.add(file.src);
  }
  return [...hrefs].map((href) => ({ href }));
}
