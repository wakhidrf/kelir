// Theme state + persistence for KelirProvider. Split out of
// kelir-provider.tsx (SRP, <= 100 lines). kelir-provider.tsx composes it.
// Behavior (hook order, effects, persistence) is unchanged.

import * as React from "react";
import { persistThemeCookie } from "@/controllers/theme-actions";
import { KELIR_THEMES } from "./kelir-theme-list";
import { THEME_ATTRIBUTE } from "./kelir-styles";
import { useSwitcherRegistry } from "./kelir-switcher-registry";
import type { Theme } from "./kelir-types";

export function useKelirThemeState(defaultTheme: Theme) {
  // Server-driven: the provider starts at the theme the server already
  // rendered (cookie or static default). It is a plain selectable state.
  const [themeName, setThemeName] = React.useState<Theme>(defaultTheme);
  const { registerSwitcher, unregisterSwitcher, switcherCountRef } =
    useSwitcherRegistry();

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
  const themesList = React.useMemo(() => KELIR_THEMES, []);

  return {
    themeName,
    setTheme,
    themesList,
    registerSwitcher,
    unregisterSwitcher,
  };
}