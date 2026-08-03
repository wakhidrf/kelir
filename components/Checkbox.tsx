import * as React from "react";
import { useKelir } from "../KelirProvider";
import { CheckboxProps } from "../types";
import { Checkbox as NeumorphismCheckbox } from "../themes/neumorphism/checkbox";

export function Checkbox(props: CheckboxProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCheckbox {...props} />;
  }

  return null;
}
