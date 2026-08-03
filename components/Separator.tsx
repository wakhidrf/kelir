import * as React from "react";
import { useKelir } from "../KelirProvider";
import { SeparatorProps } from "../types";
import { Separator as NeumorphismSeparator } from "../themes/neumorphism/separator";

export function Separator(props: SeparatorProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSeparator {...props} />;
  }

  return null;
}
