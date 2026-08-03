import * as React from "react";
import { useKelir } from "../KelirProvider";
import { SelectProps } from "../types";
import { Select as NeumorphismSelect } from "../themes/neumorphism/select";

export function Select(props: SelectProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSelect {...props} />;
  }

  return null;
}
