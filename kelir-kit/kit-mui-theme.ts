// MUI theme factory (neutral base; visuals come from CSS variables). Split out
// of kelir-provider.tsx (SRP, <= 100 lines). kelir-provider.tsx memoizes it.
// Behavior is unchanged.

import { createTheme } from "@mui/material/styles";
import { kelirMuiComponents } from "./kit-mui-components";
import { rounded, variants } from "./kit-variant-values";

// Create a single static MUI dynamic theme.
// It MUST be the exact same object on the server and the client: MUI's
// emotion cache hashes the theme object into every generated class name
// (css-<hash>-Mui...), so any server/client difference in the theme produces
// a hydration mismatch on every MUI element. The object is therefore built
// once from the theme-agnostic neutral base and never changes. Theme visuals
// are driven by CSS variables (data-kelir-theme attribute), which MUI cannot
// parse for its color math — MUI palette-rendering stays neutral.
export function createKelirMuiTheme() {
  const baseColors: Record<string, string> = {
    primary: variants.primary,
    secondary: variants.secondary,
    tertiary: variants.tertiary,
    neutral: variants.neutral,
    background: variants.background,
    surface: variants.surface,
    textPrimary: variants.textPrimary,
    textSecondary: variants.textSecondary,
  };

  // MUI runs color math (alpha/emphasize) on palette values at render time,
  // which cannot parse CSS gradients. When a theme's background is a
  // gradient (e.g. glassmorphism), map it to a solid MUI-safe color so
  // popups/surfaces never throw a "color" error.
  const muiBackground =
    baseColors.baseBackground ||
    (baseColors.background.includes("gradient(")
      ? baseColors.surface || baseColors.background
      : baseColors.background);

  return createTheme({
    palette: {
      mode: "light",
      primary: { main: baseColors.primary },
      secondary: { main: baseColors.secondary },
      background: {
        default: muiBackground,
        paper: baseColors.surface || muiBackground,
      },
      text: {
        primary: baseColors.textPrimary,
        secondary: baseColors.textSecondary,
      },
    },
    typography: {
      fontFamily: "var(--kelir-font-active, sans-serif)",
      h1: {
        fontSize: "var(--type-h1, 2.25rem)",
        fontWeight: "var(--type-weight-h1, 700)",
      },
      h2: {
        fontSize: "var(--type-h2, 1.5rem)",
        fontWeight: "var(--type-weight-h2, 600)",
      },
      body1: {
        fontSize: "var(--type-body, 1rem)",
        fontWeight: "var(--type-weight-body, 400)",
        lineHeight: "var(--type-lineheight-body, 1.6)",
      },
      body2: {
        fontSize: "var(--type-small, 0.875rem)",
        fontWeight: "var(--type-weight-label, 500)",
        lineHeight: "var(--type-lineheight-body, 1.6)",
      },
    },
    shape: {
      borderRadius: parseInt(rounded.sm, 10),
    },
    components: kelirMuiComponents,
  });
}