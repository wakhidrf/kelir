// Barrel — varian token, `css`, dan scrollbar. Dipecah per tanggung jawab di
// file sibling (SRP; tiap file <= 100 baris). Nama & bentuk ekspor tidak
// berubah; impor `../kelir-variants` dan `./kelir-variants` tetap sah.
//
// - tipe:          ./kelir-variants-types
// - nilai netral:  ./kelir-variant-values
// - builder css:   ./kelir-css-sections + ./kelir-create-css
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