// Barrel - token variants, `css`, and the scrollbar. Split per responsibility
// into sibling files (SRP; each file <= 100 lines). Names and shapes are
// unchanged; imports `../kelir-variants` and `./kelir-variants` stay valid.
//
// - types:         ./kelir-variants-types
// - neutral value: ./kelir-variant-values
// - css builder:   ./kelir-css-sections + ./kelir-create-css
// - scrollbar:     ./kelir-scrollbar

export type {
  KelirRounded,
  KelirShadows,
  KelirVariants,
} from "./kelir-variants-types";
export { createCss, css } from "./kelir-create-css";
export {
  rounded,
  shadows,
  statusColors,
  variants,
} from "./kelir-variant-values";
export type { VariantName } from "./kelir-variant-values";
export { scrollbarClass, scrollbarCss } from "./kelir-scrollbar";