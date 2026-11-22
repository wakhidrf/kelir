// Theme state + persistence for KelirProvider. Split out of
// kelir-provider.tsx (SRP, <= 100 lines). kelir-provider.tsx composes it.
// Behavior (hook order, effects, persistence) is unchanged.

import * as React from "react";
import { persistThemeCookie } from "@/controllers/theme-actions";
import { KELIR_THEMES } from "./kelir-design/kelir-theme-list";
import { readStoredTheme, writeStoredTheme } from "./kelir-design/kelir-theme-storage";
import { THEME_ATTRIBUTE } from "./kelir-design/kelir-style-constants";
import { useSwitcherRegistry } from "./kelir-switcher-registry";
import type { Theme, ThemeMode } from "./kelir-kit/kit-provider";

export function useKelirThemeState(defaultTheme: Theme, themeMode: ThemeMode) {
  // Cookie mode: server-driven — the provider starts at the theme the server
  // already rendered. Client mode: the pre-paint inline script owns the first
  // paint, so state starts at the default and adopts localStorage after mount.
  const isClient = themeMode === "client";
  const [themeName, setThemeName] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);
  const { registerSwitcher, unregisterSwitcher, switcherCountRef } =
    useSwitcherRegistry(isClient);

  // Client mode only: after mount, bring React state (and the theme-dependent
  // font preloads) into agreement with the stored theme the script applied.
  React.useEffect(() => {
    if (!isClient) return;
    setThemeName(readStoredTheme(defaultTheme));
    setMounted(true);
  }, [isClient, defaultTheme]);

  // Keep the attribute in sync so CSS-variable-driven styling follows the theme.
  // In client mode the initial commit must not overwrite the script's pre-paint
  // value with the server default before the mount effect adopts the stored one.
  React.useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    if (isClient && !mounted) return;
    document.documentElement.setAttribute(THEME_ATTRIBUTE, themeName);
  }, [themeName, isClient, mounted]);

  // Setter updates the local value (drives MUI and the attribute synchronously so
  // CSS-var-driven text doesn't flash). Persistence follows the mode: client
  // mode always writes localStorage (the user's stored preference, no server);
  // cookie mode persists through a Server Action only while a switcher is
  // mounted, so a page with no switcher keeps a shared origin clean.
  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeName(next);
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
      }
      if (isClient) {
        writeStoredTheme(next);
        return;
      }
      if (switcherCountRef.current > 0) {
        void persistThemeCookie(next).catch(() => {
          // ignore persistence errors; local state stays consistent
        });
      }
    },
    [isClient, switcherCountRef],
  );

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
