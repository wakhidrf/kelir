import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { SelectProps } from "../types.js";
import { Select as NeumorphismSelect } from "../themes/neumorphism/select.js";

export function Select(props: SelectProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSelect {...props} />;
  }

  return null;
}
