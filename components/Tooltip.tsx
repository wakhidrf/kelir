import * as React from "react";
import { useKelir } from "../KelirProvider";
import { TooltipProps } from "../types";
import { Tooltip as NeumorphismTooltip } from "../themes/neumorphism/tooltip";

export function Tooltip(props: TooltipProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTooltip {...props} />;
  }

  return null;
}
