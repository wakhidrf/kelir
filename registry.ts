import { tokens as neumorphismTokens } from "./themes/neumorphism/tokens";
import { productSans } from "./fonts/product-sans";

export const themeRegistry = {
  neumorphism: {
    slug: "neumorphism",
    label: "Neumorphism",
    tokens: neumorphismTokens,
  },
} as const;

export const fontRegistry = {
  "product-sans": productSans,
} as const;
