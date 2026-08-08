import { tokens as auroraUiTokens } from "./kelir-themes/aurora-ui";
import { tokens as claymorphismTokens } from "./kelir-themes/claymorphism";
import { tokens as dimensionalLayeringTokens } from "./kelir-themes/dimensional-layering";
import { tokens as editorialToken } from "./kelir-themes/editorial-contemporaneo";
import { tokens as edtechPlataformaTokens } from "./kelir-themes/edtech-plataforma";
import { tokens as futuristicGlassTokens } from "./kelir-themes/futuristic-glassmorphism";
import { tokens as glassmorphismTokens } from "./kelir-themes/glassmorphism";
import { tokens as liquidGlassTokens } from "./kelir-themes/liquid-glass";
import { tokens as neumorphismTokens } from "./kelir-themes/neumorphism";
import { tokens as skeuomorphismTokens } from "./kelir-themes/skeuomorphism";
import { tokens as spatialUiTokens } from "./kelir-themes/spatial-ui";

export const themeRegistry = {
  "aurora-ui": {
    slug: "aurora-ui",
    label: "Aurora UI",
    tokens: auroraUiTokens,
  },
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
  claymorphism: {
    slug: "claymorphism",
    label: "Claymorphism",
    tokens: claymorphismTokens,
  },
  skeuomorphism: {
    slug: "skeuomorphism",
    label: "Skeuomorphism",
    tokens: skeuomorphismTokens,
  },
  "liquid-glass": {
    slug: "liquid-glass",
    label: "Liquid Glass",
    tokens: liquidGlassTokens,
  },
  "spatial-ui": {
    slug: "spatial-ui",
    label: "Spatial UI (VisionOS)",
    tokens: spatialUiTokens,
  },
  "futuristic-glassmorphism": {
    slug: "futuristic-glassmorphism",
    label: "Futuristic UI Glassmorphism",
    tokens: futuristicGlassTokens,
  },
  "dimensional-layering": {
    slug: "dimensional-layering",
    label: "Dimensional Layering",
    tokens: dimensionalLayeringTokens,
  },
  "editorial-contemporaneo": {
    slug: "editorial-contemporaneo",
    label: "Contemporary Editorial",
    tokens: editorialToken,
  },
  "edtech-plataforma": {
    slug: "edtech-plataforma",
    label: "EdTech Course Platform",
    tokens: edtechPlataformaTokens,
  },
} as const;
