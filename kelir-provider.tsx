"use client";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useTheme } from "next-themes";
import * as React from "react";
import { themeRegistry } from "./kelir-registry";
import { fontLinks, kelirStyleCss, THEME_ATTRIBUTE } from "./kelir-styles";
import type { KelirContextValue, Theme } from "./kelir-types";
import { rounded, variants } from "./kelir-variants";

export const KelirContext = React.createContext<KelirContextValue | null>(null);

export function useKelir() {
  const context = React.useContext(KelirContext);
  if (!context) {
    throw new Error("useKelir must be used within a KelirProvider");
  }
  return context;
}

interface KelirProviderProps {
  children: React.ReactNode;
  /** Consumer-provided default theme (from its own persisted cookie). */
  defaultTheme: Theme;
}

export function KelirProvider({ children, defaultTheme }: KelirProviderProps) {
  // Theme state is owned by next-themes (persisted + pre-hydration script).
  const { theme: activeTheme, setTheme: setActiveTheme } = useTheme();
  // Keep a local value initialized from the persisted theme attribute that
  // next-themes' pre-hydration script already set on <html>. Reading it
  // synchronously on first render means the NativeSelect never flashes the
  // default theme's label on refresh.
  const [themeName, setThemeName] = React.useState<Theme>(() => {
    if (typeof document === "undefined") return defaultTheme;
    const saved = document.documentElement.getAttribute(THEME_ATTRIBUTE);
    return saved && saved in themeRegistry ? (saved as Theme) : defaultTheme;
  });

  // Adopt the persisted theme from next-themes once it settles after mount.
  React.useEffect(() => {
    if (activeTheme && activeTheme in themeRegistry) {
      setThemeName(activeTheme as Theme);
    }
  }, [activeTheme]);

  // Setter updates both the local value (drives MUI) and next-themes
  // (persists to localStorage + sets the pre-hydration attribute).
  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeName(next);
      // Apply the theme attribute synchronously so CSS-var-driven text
      // (e.g. NativeSelect) doesn't flash to the default theme before
      // next-themes' effect runs.
      document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
      setActiveTheme(next);
    },
    [setActiveTheme],
  );

  // Available lists
  const themesList = React.useMemo(
    () => [
      { slug: "aurora-ui" as Theme, label: "Aurora UI" },
      { slug: "neumorphism" as Theme, label: "Neumorphism" },
      { slug: "glassmorphism" as Theme, label: "Glassmorphism" },
      { slug: "claymorphism" as Theme, label: "Claymorphism" },
      {
        slug: "dimensional-layering" as Theme,
        label: "Dimensional Layering",
      },
      {
        slug: "editorial-contemporaneo" as Theme,
        label: "Contemporary Editorial",
      },
      { slug: "edtech-plataforma" as Theme, label: "EdTech Course Platform" },
      { slug: "skeuomorphism" as Theme, label: "Skeuomorphism" },
      { slug: "liquid-glass" as Theme, label: "Liquid Glass" },
      { slug: "spatial-ui" as Theme, label: "Spatial UI (VisionOS)" },
      {
        slug: "futuristic-glassmorphism" as Theme,
        label: "Futuristic UI Glassmorphism",
      },
    ],
    [],
  );

  // Create a single static MUI dynamic theme.
  // It MUST be the exact same object on the server and the client: MUI's
  // emotion cache hashes the theme object into every generated class name
  // (css-<hash>-Mui...), so any server/client difference in the theme produces
  // a hydration mismatch on every MUI element. The object is therefore built
  // once from the theme-agnostic neutral base and never changes. Theme visuals
  // are driven by CSS variables (data-kelir-theme attribute), which MUI cannot
  // parse for its color math — MUI palette-rendering stays neutral.
  const muiTheme = React.useMemo(() => {
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
      components: {
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              borderRadius: "var(--control-radius, var(--radius-sm))",
              textTransform: "none",
              fontWeight: 600,
              padding: "var(--control-padding, 12px)",
              fontFamily: "inherit",
              transition: `all var(--motion-duration-hover, 200ms) var(--motion-easing-curve, ease-out)`,
              "&:focus-visible": {
                outline: "none",
                boxShadow: `0 0 0 var(--focus-ring-width) var(--focus-ring-color)`,
                outlineOffset: "var(--focus-ring-offset)",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-surface)",
              boxShadow: "var(--shadow-card)",
              border:
                "1px solid var(--color-border-light, rgba(255, 255, 255, 0.4))",
            },
          },
        },
      },
    });
  }, []);

  const contextValue = React.useMemo<KelirContextValue>(
    () => ({
      theme: themeName,
      setTheme,
      themes: themesList,
    }),
    [themeName, setTheme, themesList],
  );

  return (
    <>
      {/* Theme token CSS + scrollbar. Injected by Kelir itself so consumers
          don't need any token stylesheet. Selectors match the data-kelir-theme
          attribute, so the saved theme applies before first paint (no flash).
          Rendered as React children (a static string, not user input) so no
          dangerouslySetInnerHTML is needed. */}
      <style>{kelirStyleCss()}</style>
      {/* Theme fonts. Rendered before the content so they load render-blocking
          and are cached — switching themes/fonts never flashes to a fallback.
          React 19 dedupes identical <link>s by href. */}
      {fontLinks().map(({ href }) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <KelirContext.Provider value={contextValue}>
        <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
      </KelirContext.Provider>
    </>
  );
}
