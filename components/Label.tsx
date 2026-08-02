import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { LabelProps } from "../types.js";
import { Label as NeumorphismLabel } from "../themes/neumorphism/label.js";

export function Label(props: LabelProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismLabel {...props} />;
  }

  return null;
}
