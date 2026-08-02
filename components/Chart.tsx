import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ChartProps } from "../types.js";
import { Chart as NeumorphismChart } from "../themes/neumorphism/chart.js";

export function Chart(props: ChartProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismChart {...props} />;
  }

  return null;
}
