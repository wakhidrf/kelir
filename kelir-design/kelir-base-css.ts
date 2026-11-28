// Base stylesheet (reset + body/canvas + pre-ready hiding). Split out of
// kelir-styles.ts (SRP, <= 100 lines); the kelir-styles.ts barrel composes it
// into the final kit stylesheet. Behavior is unchanged.

import { layoutVars } from "../kelir-kit/kit-layout-vars";
import { hideBeforeReadyCss } from "./kelir-style-constants";
import { typographyVars } from "../kelir-kit/kit-typography";

// Base stylesheet that makes Kelir the single source of appearance. The
// page-level (body) colors and font follow the active theme's CSS variables,
// so the whole page restyles instantly when the theme changes.
export const baseCss = `
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
    /* Critical (§3b STYLE.md): !important inside a layer beats unlayered normal
       CSS from consumers — without it, a plain importer override would win over
       the kit stylesheet. The critical list is limited: background, text color,
       font. Beyond this list, !important is forbidden. */
    background-color: var(--color-background-base, #f5f6f7) !important;
    color: var(--color-text-primary, #1f2328) !important;
    font-family: var(--kelir-font-active, sans-serif) !important;
    color-scheme: var(--kelir-color-scheme, light);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: var(--kelir-flow-opacity, 0);
    background:
      radial-gradient(600px 500px at 20% 30%, rgba(0, 128, 255, 0.5) 0%, transparent 70%),
      radial-gradient(700px 600px at 80% 70%, rgba(255, 20, 147, 0.35) 0%, transparent 70%),
      radial-gradient(500px 500px at 45% 55%, rgba(0, 255, 255, 0.25) 0%, transparent 70%);
    background-size: 200% 200%;
    animation: var(--kelir-flow-anim, none);
  }
  /* Theme canvas is locked to the viewport (fixed layer) instead of being
     painted over the full scrollable height. Keeps the gradient computed
     against viewport size only, so long pages no longer stretch, relocate or
     band the gradient (banding). Below the fold, body's solid
     --color-background-base takes over seamlessly. */
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -2;
    pointer-events: none;
    background: var(--color-background, transparent);
    background-repeat: no-repeat;
  }
  /* Before the theme is resolved (data-kelir-ready not "true" yet), the whole
     page stays at the browser default: body hidden, plain background, no themed
     canvas and no theme text colors. KelirProvider flips the attribute to
     "true" right before paint once it has read the persisted theme (switcher)
     or on mount (server-driven default), so neither the server default theme
     nor its background are ever shown — not even for a single frame. */
  ${hideBeforeReadyCss}
  h1, h2 {
    text-shadow: var(--kelir-chroma, none);
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  ::selection {
    background: var(--color-primary, #8a8f98);
    color: var(--color-on-primary, #ffffff);
  }
`;
