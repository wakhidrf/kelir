import * as React from "react";
import { useKelir } from "../KelirProvider";
import { SwitchProps } from "../types";
import { Switch as NeumorphismSwitch } from "../themes/neumorphism/switch";

export function Switch(props: SwitchProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSwitch {...props} />;
  }

  return null;
}
