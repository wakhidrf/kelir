import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ComboboxProps } from "../types.js";
import { Combobox as NeumorphismCombobox } from "../themes/neumorphism/combobox.js";

export function Combobox(props: ComboboxProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCombobox {...props} />;
  }

  return null;
}
