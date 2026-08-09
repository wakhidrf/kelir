import * as React from "react";
import { Select } from "./kelir-components/select";
import { useKelir } from "./kelir-provider";
import type { Theme } from "./kelir-types";

export function KelirSwitcher() {
  const { theme, setTheme, themes } = useKelir();
  // Theme state is client-only (read from localStorage after mount). Rendering
  // the control only after mount prevents the server from printing a
  // theme-dependent label that would flash the wrong value on hydration.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
