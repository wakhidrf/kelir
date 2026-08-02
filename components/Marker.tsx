import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { MarkerProps } from "../types.js";
import { Marker as NeumorphismMarker } from "../themes/neumorphism/marker.js";

export function Marker(props: MarkerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismMarker {...props} />;
  }

  return null;
}
