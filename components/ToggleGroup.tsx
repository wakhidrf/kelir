import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ToggleGroupProps } from "../types.js";
import { ToggleGroup as NeumorphismToggleGroup } from "../themes/neumorphism/toggle-group.js";

export function ToggleGroup(props: ToggleGroupProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismToggleGroup {...props} />;
  }

  return null;
}
