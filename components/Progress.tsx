import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ProgressProps } from "../types.js";
import { Progress as NeumorphismProgress } from "../themes/neumorphism/progress.js";

export function Progress(props: ProgressProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismProgress {...props} />;
  }

  return null;
}
