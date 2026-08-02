import * as React from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { Theme, Font, KelirContextValue } from "./types.js";
import { themeRegistry, fontRegistry } from "./registry.js";

// Validation for secure font injection
const CDN_FONT_REGEX = /^https:\/\/fonts\.cdnfonts\.com\/css\/[a-zA-Z0-9_-]+$/;

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
  defaultTheme?: Theme;
  defaultFont?: Font;
}

export function KelirProvider({
  children,
  defaultTheme = "neumorphism",
  defaultFont = "product-sans",
}: KelirProviderProps) {
  const [themeName, setThemeName] = React.useState<Theme>(defaultTheme);
  const [fontName, setFontName] = React.useState<Font>(defaultFont);

  // Available lists
  const themesList = React.useMemo(() => [{ slug: "neumorphism" as Theme, label: "Neumorphism" }], []);
  const fontsList = React.useMemo(() => [{ slug: "product-sans" as Font, family: "Product Sans" }], []);

  // Update design tokens and CSS variables in the DOM
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const tokens = themeRegistry[themeName]?.tokens;
    if (!tokens) return;

    const root = document.documentElement;
    // Set colors
    root.style.setProperty("--color-primary", tokens.colors.primary);
    root.style.setProperty("--color-secondary", tokens.colors.secondary);
    root.style.setProperty("--color-tertiary", tokens.colors.tertiary);
    root.style.setProperty("--color-background", tokens.colors.background);
    root.style.setProperty("--color-surface", tokens.colors.surface);
    root.style.setProperty("--color-text-primary", tokens.colors.textPrimary);
    root.style.setProperty("--color-text-secondary", tokens.colors.textSecondary);

    // Set radiuses
    root.style.setProperty("--radius-sm", tokens.rounded.sm);
    root.style.setProperty("--radius-md", tokens.rounded.md);
    root.style.setProperty("--radius-lg", tokens.rounded.lg);

    // Set shadows
    root.style.setProperty("--shadow-convex", tokens.shadows.convex);
    root.style.setProperty("--shadow-concave", tokens.shadows.concave);
    root.style.setProperty("--shadow-card", tokens.shadows.card);
  }, [themeName]);

  // Load font and apply --kelir-font-active
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const fontDef = fontRegistry[fontName];
    if (!fontDef) return;

    const { family, fallback, importUrl, cssVariable } = fontDef;

    // Secure validation of the URL before injection
    if (CDN_FONT_REGEX.test(importUrl)) {
      const existingLink = document.querySelector(`link[href="${importUrl}"]`);
      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = importUrl;
        document.head.appendChild(link);
      }
    }

    // Set font CSS variable
    document.documentElement.style.setProperty(cssVariable, `'${family}', ${fallback}`);
  }, [fontName]);

  // Create MUI dynamic theme
  const muiTheme = React.useMemo(() => {
    const tokens = themeRegistry[themeName]?.tokens;
    const baseColors = tokens?.colors || {
      primary: "#C8E0F4",
      secondary: "#F5E0E8",
      background: "#E8E8E8",
      textPrimary: "#333333",
      textSecondary: "#666666",
    };

    const baseRounded = tokens?.rounded || { sm: "14px", md: "28px", lg: "42px" };

    return createTheme({
      palette: {
        mode: "light",
        primary: { main: baseColors.primary },
        secondary: { main: baseColors.secondary },
        background: {
          default: baseColors.background,
          paper: baseColors.surface || baseColors.background,
        },
        text: {
          primary: baseColors.textPrimary,
          secondary: baseColors.textSecondary,
        },
      },
      typography: {
        fontFamily: "var(--kelir-font-active, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
        h1: { fontSize: tokens?.typography?.h1?.fontSize, fontWeight: tokens?.typography?.h1?.fontWeight },
        body1: { fontSize: tokens?.typography?.bodyMd?.fontSize, fontWeight: tokens?.typography?.bodyMd?.fontWeight },
      },
      shape: {
        borderRadius: parseInt(baseRounded.sm),
      },
      components: {
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              borderRadius: baseRounded.sm,
              textTransform: "none",
              fontWeight: 600,
              padding: "10px 20px",
              fontFamily: "inherit",
              transition: "all 150ms ease-out",
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: baseRounded.sm,
              backgroundColor: baseColors.surface,
              boxShadow: tokens?.shadows?.card,
              border: "1px solid rgba(255, 255, 255, 0.4)",
            },
          },
        },
      },
    });
  }, [themeName]);

  const contextValue = React.useMemo<KelirContextValue>(
    () => ({
      theme: themeName,
      setTheme: setThemeName,
      font: fontName,
      setFont: setFontName,
      themes: themesList,
      fonts: fontsList,
    }),
    [themeName, fontName, themesList, fontsList]
  );

  return (
    <KelirContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </KelirContext.Provider>
  );
}
