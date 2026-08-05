import { NativeSelect } from "./kelir-components/native-select";
import { useKelir } from "./kelir-provider";
import type { Theme } from "./kelir-types";

export function KelirSwitcher() {
  const { theme, setTheme, themes } = useKelir();

  return (
    <NativeSelect
      size="small"
      value={theme}
      onChange={(e) => setTheme(e.target.value as Theme)}
      options={themes.map((t) => ({ value: t.slug, label: t.label }))}
      style={{ fontFamily: "inherit", fontSize: "13px", fontWeight: 500 }}
    />
  );
}
