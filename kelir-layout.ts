// Single source of truth for layout tokens, per the shared `## Layout` section
// in every design.md (all four themes declare identical values).
//
// Layout is theme-agnostic: spacing rhythm (0.5rem base unit), page container,
// section gaps, mobile breakpoint and the z-index contract are the same across
// neumorphism/glassmorphism/claymorphism/skeuomorphism. KelirProvider emits
// these as CSS variables on `:root`; kelir-components reference them via
// `css.layout` (resolved through `import { css } from "../kelir-variants"`).
//
// Barrel: types live in ./kelir-layout-types, values in ./kelir-layout-tokens,
// CSS variables in ./kelir-layout-vars. Names are unchanged.

export type { KelirLayoutTokens, KelirSpace } from "./kelir-layout-types";
export { layout } from "./kelir-layout-tokens";
export type { LayoutSpaceName } from "./kelir-layout-tokens";
export { layoutVars } from "./kelir-layout-vars";