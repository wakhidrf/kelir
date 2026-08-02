import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { SeparatorProps } from "../types.js";
import { Separator as NeumorphismSeparator } from "../themes/neumorphism/separator.js";

export function Separator(props: SeparatorProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSeparator {...props} />;
  }

  return null;
}
