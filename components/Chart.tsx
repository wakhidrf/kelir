import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ChartProps } from "../types";
import { Chart as NeumorphismChart } from "../themes/neumorphism/chart";

export function Chart(props: ChartProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismChart {...props} />;
  }

  return null;
}
