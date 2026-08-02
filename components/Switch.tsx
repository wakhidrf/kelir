import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { SwitchProps } from "../types.js";
import { Switch as NeumorphismSwitch } from "../themes/neumorphism/switch.js";

export function Switch(props: SwitchProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSwitch {...props} />;
  }

  return null;
}
