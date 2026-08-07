import { tokens as glassmorphismTokens } from "./kelir-themes/glassmorphism";
import { tokens as neumorphismTokens } from "./kelir-themes/neumorphism";

export const themeRegistry = {
  neumorphism: {
    slug: "neumorphism",
    label: "Neumorphism",
    tokens: neumorphismTokens,
  },
  glassmorphism: {
    slug: "glassmorphism",
    label: "Glassmorphism",
    tokens: glassmorphismTokens,
  },
} as const;
