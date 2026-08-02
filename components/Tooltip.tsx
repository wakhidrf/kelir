import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { TooltipProps } from "../types.js";
import { Tooltip as NeumorphismTooltip } from "../themes/neumorphism/tooltip.js";

export function Tooltip(props: TooltipProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTooltip {...props} />;
  }

  return null;
}
