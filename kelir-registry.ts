import { tokens as kawaiiSweetPastelTokens } from "./kelir-themes/kawaii-sweet-pastel";
import { tokens as neumorphismTokens } from "./kelir-themes/neumorphism";

export const themeRegistry = {
  "kawaii-sweet-pastel": {
    slug: "kawaii-sweet-pastel",
    label: "Kawaii Sweet Pastel",
    tokens: kawaiiSweetPastelTokens,
  },
  neumorphism: {
    slug: "neumorphism",
    label: "Neumorphism",
    tokens: neumorphismTokens,
  },
} as const;
