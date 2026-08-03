import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ToggleProps } from "../types";
import { Toggle as NeumorphismToggle } from "../themes/neumorphism/toggle";

export function Toggle(props: ToggleProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismToggle {...props} />;
  }

  return null;
}
