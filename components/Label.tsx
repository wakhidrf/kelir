import * as React from "react";
import { useKelir } from "../KelirProvider";
import { LabelProps } from "../types";
import { Label as NeumorphismLabel } from "../themes/neumorphism/label";

export function Label(props: LabelProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismLabel {...props} />;
  }

  return null;
}
