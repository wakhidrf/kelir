import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { AspectRatioProps } from "../types.js";
import { AspectRatio as NeumorphismAspectRatio } from "../themes/neumorphism/aspect-ratio.js";

export function AspectRatio(props: AspectRatioProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAspectRatio {...props} />;
  }

  return null;
}
