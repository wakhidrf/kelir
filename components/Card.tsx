import * as React from "react";
import { useKelir } from "../KelirProvider";
import { CardProps } from "../types";
import { Card as NeumorphismCard } from "../themes/neumorphism/card";

export function Card(props: CardProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCard {...props} />;
  }

  return null;
}
