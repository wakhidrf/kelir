"use client";

// KelirProvider: the only legitimate visual entry point (§3c). Split into
// sibling modules (SRP, <= 100 lines):
//   - ./kelir-provider-state  theme state / switcher / persistence hook
//   - ./kelir-mui-theme       neutral MUI theme factory
//   - ./kelir-mui-components  MUI component overrides
// Public exports (KelirProvider, KelirContext, useKelir) are unchanged.

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { createKelirMuiTheme } from "./kelir-mui-theme";
import { useKelirThemeState } from "./kelir-provider-state";
import { fontLinks, kelirStyleCss } from "./kelir-styles";
import type {
  KelirContextValue,
  KelirProviderProps,
} from "./kelir-types";

export const KelirContext = React.createContext<KelirContextValue | null>(null);

export function useKelir() {
  const context = React.useContext(KelirContext);
  if (!context) {
    throw new Error("useKelir must be used within a KelirProvider");
  }
  return context;
}

export function KelirProvider({
  children,
  defaultTheme,
  brandFont,
  brandColors,
}: KelirProviderProps) {
  const {
    themeName,
    setTheme,
    themesList,
    registerSwitcher,
    unregisterSwitcher,
  } = useKelirThemeState(defaultTheme);

  const muiTheme = React.useMemo(() => createKelirMuiTheme(), []);

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
      {/* Consumer brand font (identity, not layout): the kit that installs
          exposes its variable; braces are stripped so a value cannot escape
          the declaration (the string is still rendered as React text, not HTML). */}
      {brandFont ? (
        <style>
          {`:root { --kelir-font-brand: ${brandFont.replace(/[;{}<>]/g, "")}; }`}
        </style>
      ) : null}
      {/* Consumer brand colors (identity, not theme): two fixed slots,
          `tone="brand-accent"|"brand-ink"`. Same as the brand font, values are
          sanitized before entering the declaration. */}
      {brandColors ? (
        <style>
          {`:root { --kelir-brand-accent: ${brandColors.accent.replace(/[;{}<>]/g, "")}; --kelir-brand-ink: ${brandColors.ink.replace(/[;{}<>]/g, "")}; }`}
        </style>
      ) : null}
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