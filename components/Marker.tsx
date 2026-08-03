import * as React from "react";
import { useKelir } from "../KelirProvider";
import { MarkerProps } from "../types";
import { Marker as NeumorphismMarker } from "../themes/neumorphism/marker";

export function Marker(props: MarkerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismMarker {...props} />;
  }

  return null;
}
