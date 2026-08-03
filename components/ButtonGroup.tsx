import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ButtonGroupProps } from "../types";
import { ButtonGroup as NeumorphismButtonGroup } from "../themes/neumorphism/button-group";

export function ButtonGroup(props: ButtonGroupProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismButtonGroup {...props} />;
  }

  return null;
}
