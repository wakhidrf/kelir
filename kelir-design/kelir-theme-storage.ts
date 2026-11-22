// Client-mode (themeMode="client") theme persistence via localStorage. The
// pre-paint inline script (clientThemeScript) stamps the stored theme onto
// <html>; the provider reads/writes the same key so React state (font preloads,
// context) and the DOM attribute stay in agreement. Cookie mode never calls
// this. Split out of kelir-provider-state.ts (SRP, <= 100 lines).

import { themeRegistry } from "./kelir-registry";
import { THEME_STORAGE_KEY } from "./kelir-style-constants";
import type { Theme } from "../kelir-kit/kit-provider";

// The stored slug is validated against the registry so a stale/foreign value
// falls back to the server default instead of matching no theme selector.
export function readStoredTheme(fallback: Theme): Theme {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value && value in themeRegistry ? (value as Theme) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // private mode / quota exceeded — ignore; the in-memory theme still applies
  }
}
