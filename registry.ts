import { tokens as neumorphismTokens } from "./themes/neumorphism/tokens.js";
import { productSans } from "./fonts/product-sans.js";

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
