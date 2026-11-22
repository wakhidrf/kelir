// CSS variables for the layout tokens, installed on `:root` so they are usable
// from any inline style / sx without importing the JS object. Split out of
// kelir-layout.ts (SRP, <= 100 lines); the kelir-layout.ts barrel re-exports it.

import { layout } from "./kit-layout-tokens";

export const layoutVars: string =
  `--space-xs: ${layout.space.xs};\n` +
  `--space-sm: ${layout.space.sm};\n` +
  `--space-md: ${layout.space.md};\n` +
  `--space-lg: ${layout.space.lg};\n` +
  `--space-xl: ${layout.space.xl};\n` +
  `--space-2xl: ${layout.space["2xl"]};\n` +
  `--space-3xl: ${layout.space["3xl"]};\n` +
  `--space-4xl: ${layout.space["4xl"]};\n` +
  `--layout-container-max: ${layout.container.maxWidth};\n` +
  `--layout-container-pad: ${layout.container.sidePadding};\n` +
  `--layout-section-gap: ${layout.sectionGap};\n` +
  `--layout-hero-collapse: ${layout.breakpoints.heroCollapse};\n` +
  `--layout-mobile: ${layout.breakpoints.mobile};\n` +
  `--grid-min-sm: ${layout.gridMin.sm};\n` +
  `--grid-min-md: ${layout.gridMin.md};\n` +
  `--page-pad-top: ${layout.page.paddingTop};\n` +
  `--page-pad-inline: ${layout.page.paddingInline};\n` +
  `--page-pad-inline-mobile: ${layout.page.paddingInlineMobile};\n` +
  `--page-pad-bottom: ${layout.page.paddingBottom};\n` +
  `--page-content-max: ${layout.page.contentMax};\n` +
  `--page-gap: ${layout.page.gap};\n` +
  `--page-header-gap: ${layout.page.headerGap};\n` +
  `--page-header-gap-mobile: ${layout.page.headerGapMobile};\n` +
  `--page-main-min-height: ${layout.page.mainMinHeight};\n` +
  `--page-main-pad-block: ${layout.page.mainPaddingBlock};\n` +
  `--page-footer-pad-top: ${layout.page.footerPaddingTop};\n` +
  `--page-footer-gap: ${layout.page.footerGap};\n` +
  `--z-base: ${layout.zIndex.base};\n` +
  `--z-sticky: ${layout.zIndex.sticky};\n` +
  `--z-overlay: ${layout.zIndex.overlay};\n` +
  `--z-modal: ${layout.zIndex.modal};\n` +
  `--z-toast: ${layout.zIndex.toast};\n`;