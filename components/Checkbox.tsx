import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { CheckboxProps } from "../types.js";
import { Checkbox as NeumorphismCheckbox } from "../themes/neumorphism/checkbox.js";

export function Checkbox(props: CheckboxProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCheckbox {...props} />;
  }

  return null;
}
