import * as React from "react";
import { useKelir } from "../KelirProvider";
import { AspectRatioProps } from "../types";
import { AspectRatio as NeumorphismAspectRatio } from "../themes/neumorphism/aspect-ratio";

export function AspectRatio(props: AspectRatioProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAspectRatio {...props} />;
  }

  return null;
}
