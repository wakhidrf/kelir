import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { DirectionProps } from "../types.js";
import { Direction as NeumorphismDirection } from "../themes/neumorphism/direction.js";

export function Direction(props: DirectionProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDirection {...props} />;
  }

  return null;
}
