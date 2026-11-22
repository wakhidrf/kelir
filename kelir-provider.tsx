"use client";

// KelirProvider: the only legitimate visual entry point (§3c). Split into
// sibling modules (SRP, <= 100 lines):
//   - ./kelir-provider-state        theme state / switcher / persistence hook
//   - ./kelir-provider-injections   token style + theme script + font preloads
//   - ./kelir-mui-theme             neutral MUI theme factory
// Public exports (KelirProvider, KelirContext, useKelir) are unchanged.

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { createKelirMuiTheme } from "./kelir-mui-theme";
import { KelirProviderInjections } from "./kelir-provider-injections";
import { useKelirThemeState } from "./kelir-provider-state";
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
  themeMode = "cookie",
}: KelirProviderProps) {
  const {
    themeName,
    setTheme,
    themesList,
    registerSwitcher,
    unregisterSwitcher,
  } = useKelirThemeState(defaultTheme, themeMode);

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
      <KelirProviderInjections
        brandFont={brandFont}
        brandColors={brandColors}
        themeName={themeName}
        themeMode={themeMode}
      />
      <KelirContext.Provider value={contextValue}>
        <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
      </KelirContext.Provider>
    </>
  );
}