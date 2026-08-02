import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { InputGroupProps } from "../types.js";
import { InputGroup as NeumorphismInputGroup } from "../themes/neumorphism/input-group.js";

export function InputGroup(props: InputGroupProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismInputGroup {...props} />;
  }

  return null;
}
