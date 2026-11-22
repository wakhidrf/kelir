// Canonical kit size scale (P1c STYLE.md §6): one closed union shared by every
// `size?` prop so no component invents a bespoke scale. Each component maps the
// steps it supports to kit-owned px/dimensions; unsupported steps degrade to the
// nearest/default. Closed union, no free numbers.
export type KitSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";