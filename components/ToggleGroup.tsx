import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ToggleGroupProps } from "../types";
import { ToggleGroup as NeumorphismToggleGroup } from "../themes/neumorphism/toggle-group";

export function ToggleGroup(props: ToggleGroupProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismToggleGroup {...props} />;
  }

  return null;
}
