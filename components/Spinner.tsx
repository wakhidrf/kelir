import * as React from "react";
import { useKelir } from "../KelirProvider";
import { SpinnerProps } from "../types";
import { Spinner as NeumorphismSpinner } from "../themes/neumorphism/spinner";

export function Spinner(props: SpinnerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSpinner {...props} />;
  }

  return null;
}
