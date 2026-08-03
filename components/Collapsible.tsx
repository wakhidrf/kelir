import * as React from "react";
import { useKelir } from "../KelirProvider";
import { CollapsibleProps } from "../types";
import { Collapsible as NeumorphismCollapsible } from "../themes/neumorphism/collapsible";

export function Collapsible(props: CollapsibleProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCollapsible {...props} />;
  }

  return null;
}
