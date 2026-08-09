import * as React from "react";
import { Select } from "./kelir-components/select";
import { useKelir } from "./kelir-provider";
import type { Theme } from "./kelir-types";

export function KelirSwitcher() {
  const { theme, setTheme, themes, registerSwitcher, unregisterSwitcher } =
    useKelir();

  // Presence registration: while this switcher is mounted the provider keeps
  // the theme cookie (setTheme persists); when no switcher is mounted the
  // provider deletes the cookie so a shared origin stays clean.
  React.useEffect(() => {
    registerSwitcher();
    return () => {
      unregisterSwitcher();
    };
  }, [registerSwitcher, unregisterSwitcher]);

  return (
    <Select
      size="small"
      value={theme}
      onChange={(e) => setTheme(e.target.value as Theme)}
      options={themes.map((t) => ({ value: t.slug, label: t.label }))}
      style={{ fontFamily: "inherit", fontSize: "13px", fontWeight: 500 }}
    />
  );
}
