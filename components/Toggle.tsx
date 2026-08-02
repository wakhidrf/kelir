import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ToggleProps } from "../types.js";
import { Toggle as NeumorphismToggle } from "../themes/neumorphism/toggle.js";

export function Toggle(props: ToggleProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismToggle {...props} />;
  }

  return null;
}
