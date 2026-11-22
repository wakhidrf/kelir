// Themed scrollbar: static class + CSS whose colors follow the theme tokens
// (populated at runtime by KelirProvider from kelir-design via CSS variables).
// Split out of kelir-variants.ts (SRP, <= 100 lines); the kelir-variants.ts
// barrel re-exports them. Behavior is unchanged.

import { css } from "./kit-create-css";
import { rounded } from "./kit-variant-values";

export const scrollbarClass = "kelir-scrollbar";

export const scrollbarCss = `
  .${scrollbarClass} {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, ${css.colors.textSecondary} 45%, transparent) ${css.track};
  }
  .${scrollbarClass}::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  .${scrollbarClass}::-webkit-scrollbar-track {
    background: ${css.track};
    border-radius: var(--radius-sm, ${rounded.sm});
  }
  .${scrollbarClass}::-webkit-scrollbar-thumb {
    background: ${css.track};
    border: 2px solid transparent;
    background-clip: padding-box;
    border-radius: var(--radius-sm, ${rounded.sm});
  }
  @supports (color: color-mix(in srgb, red 50%, blue)) {
    .${scrollbarClass}::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, ${css.colors.textSecondary} 45%, transparent);
    }
  }
  .${scrollbarClass}::-webkit-scrollbar-thumb:hover {
    background: ${css.colors.primary};
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;