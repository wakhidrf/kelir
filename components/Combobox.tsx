import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ComboboxProps } from "../types";
import { Combobox as NeumorphismCombobox } from "../themes/neumorphism/combobox";

export function Combobox(props: ComboboxProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCombobox {...props} />;
  }

  return null;
}
