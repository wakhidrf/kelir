import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { CollapsibleProps } from "../types.js";
import { Collapsible as NeumorphismCollapsible } from "../themes/neumorphism/collapsible.js";

export function Collapsible(props: CollapsibleProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCollapsible {...props} />;
  }

  return null;
}
