import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { SpinnerProps } from "../types.js";
import { Spinner as NeumorphismSpinner } from "../themes/neumorphism/spinner.js";

export function Spinner(props: SpinnerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSpinner {...props} />;
  }

  return null;
}
