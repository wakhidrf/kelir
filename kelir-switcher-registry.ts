// Switcher registry + cookie cleanup for KelirProvider. Split out of
// kelir-provider-state.ts (SRP, <= 100 lines). Behavior (hook order, effects)
// is unchanged.

import * as React from "react";
import { deleteThemeCookie } from "@/controllers/theme-actions";

export function useSwitcherRegistry() {
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

  return { registerSwitcher, unregisterSwitcher, switcherCountRef };
}