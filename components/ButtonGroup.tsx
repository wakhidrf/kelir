import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ButtonGroupProps } from "../types.js";
import { ButtonGroup as NeumorphismButtonGroup } from "../themes/neumorphism/button-group.js";

export function ButtonGroup(props: ButtonGroupProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismButtonGroup {...props} />;
  }

  return null;
}
