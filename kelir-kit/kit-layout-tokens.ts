// Layout token values + helper type. Split out of kelir-layout.ts (SRP, one
// responsibility, <= 100 lines); the kelir-layout.ts barrel re-exports them.
// Names and values are unchanged.

import type { KelirLayoutTokens, KelirSpace } from "./kit-layout-types";

// Scale rooted at the 0.5rem (8px) base unit from design.md. Defined once here
// and mirrored as CSS variables so consumers can also use var(--space-*) in raw
// inline styles / MUI sx when the `css` object is not in scope.
export const layout: KelirLayoutTokens = {
  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    "4xl": "4rem",
  },
  container: {
    maxWidth: "1280px",
    sidePadding: "1.5rem",
  },
  sectionGap: "clamp(4rem, 8vw, 8rem)",
  breakpoints: {
    heroCollapse: "768px",
    mobile: "600px",
  },
  gridMin: {
    sm: "200px",
    md: "320px",
  },
  page: {
    paddingTop: "96px",
    paddingInline: "24px",
    paddingInlineMobile: "16px",
    paddingBottom: "40px",
    contentMax: "1200px",
    gap: "32px",
    headerGap: "18px",
    headerGapMobile: "12px",
    mainMinHeight: "500px",
    mainPaddingBlock: "16px",
    footerPaddingTop: "32px",
    footerGap: "12px",
  },
  zIndex: {
    base: "0",
    sticky: "100",
    overlay: "200",
    modal: "300",
    toast: "500",
  },
} as const;

export type LayoutSpaceName = keyof KelirSpace;