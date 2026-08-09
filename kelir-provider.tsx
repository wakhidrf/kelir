"use client";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import * as React from "react";
import {
  deleteThemeCookie,
  persistThemeCookie,
} from "@/controllers/theme-actions";
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
  /** Consumer-provided default theme — for this app the theme cookie already
   *  resolved on the server, so the first render matches the persisted choice
   *  and there is no flash. */
  defaultTheme: Theme;
}

export function KelirProvider({ children, defaultTheme }: KelirProviderProps) {
  // Server-driven: the provider starts at the theme the server already
  // rendered (cookie or static default). It is a plain selectable state.
  const [themeName, setThemeName] = React.useState<Theme>(defaultTheme);

  // Mounted theme pickers (KelirSwitcher or equivalents). While at least one is
  // alive the theme cookie is preserved; when none is mounted the cookie is
  // deleted so a shared origin (e.g. localhost:3000 used by several projects)
  // never keeps a stale theme choice. Mirrored in a ref so setTheme can read it
  // without re-subscribing.
  const [switcherCount, setSwitcherCount] = React.useState(0);
  const switcherCountRef = React.useRef(0);

  const registerSwitcher = React.useCallback(() => {
    switcherCountRef.current += 1;
    setSwitcherCount(switcherCountRef.current);
  }, []);

  const unregisterSwitcher = React.useCallback(() => {
    switcherCountRef.current = Math.max(0, switcherCountRef.current - 1);
    setSwitcherCount(switcherCountRef.current);
  }, []);

  // A mounted switcher registers during its own effect, which runs BEFORE this
  // parent's effect on the same commit, so the count is already >= 1 here on
  // switcher pages. Waiting a tick avoids deleting on switcher pages whose
  // registration lands immediately after mount.
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      if (switcherCount === 0) {
        void deleteThemeCookie().catch(() => {
          // ignore persistence errors; local state stays consistent
        });
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [switcherCount]);

  // Keep the attribute in sync so CSS-variable-driven styling follows the theme.
  React.useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute(THEME_ATTRIBUTE, themeName);
  }, [themeName]);

  // Setter updates the local value (drives MUI and the attribute synchronously so
  // CSS-var-driven text doesn't flash). When a switcher is mounted the theme is
  // persisted to the cookie via a Server Action, so the next SSR response already
  // ships the saved theme. Without a mounted switcher the switch is transient —
  // the cookie is deleted on pages that offer no switcher, keeping a shared
  // origin clean.
  const setTheme = React.useCallback((next: Theme) => {
    setThemeName(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
    }
    if (switcherCountRef.current > 0) {
      void persistThemeCookie(next).catch(() => {
        // ignore persistence errors; local state stays consistent
      });
    }
  }, []);

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
      registerSwitcher,
      unregisterSwitcher,
    }),
    [themeName, setTheme, themesList, registerSwitcher, unregisterSwitcher],
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
