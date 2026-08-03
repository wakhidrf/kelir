import * as React from "react";
import { useKelir } from "../KelirProvider";
import { HoverCardProps } from "../types";
import { HoverCard as NeumorphismHoverCard } from "../themes/neumorphism/hover-card";

export function HoverCard(props: HoverCardProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismHoverCard {...props} />;
  }

  return null;
}
