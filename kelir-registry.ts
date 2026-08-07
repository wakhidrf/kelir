import { tokens as claymorphismTokens } from "./kelir-themes/claymorphism";
import { tokens as glassmorphismTokens } from "./kelir-themes/glassmorphism";
import { tokens as liquidGlassTokens } from "./kelir-themes/liquid-glass";
import { tokens as neumorphismTokens } from "./kelir-themes/neumorphism";
import { tokens as skeuomorphismTokens } from "./kelir-themes/skeuomorphism";
import { tokens as spatialUiTokens } from "./kelir-themes/spatial-ui";

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
} as const;
