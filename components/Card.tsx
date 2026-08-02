import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { CardProps } from "../types.js";
import { Card as NeumorphismCard } from "../themes/neumorphism/card.js";

export function Card(props: CardProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCard {...props} />;
  }

  return null;
}
