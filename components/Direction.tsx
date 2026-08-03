import * as React from "react";
import { useKelir } from "../KelirProvider";
import { DirectionProps } from "../types";
import { Direction as NeumorphismDirection } from "../themes/neumorphism/direction";

export function Direction(props: DirectionProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDirection {...props} />;
  }

  return null;
}
