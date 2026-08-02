import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { HoverCardProps } from "../types.js";
import { HoverCard as NeumorphismHoverCard } from "../themes/neumorphism/hover-card.js";

export function HoverCard(props: HoverCardProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismHoverCard {...props} />;
  }

  return null;
}
