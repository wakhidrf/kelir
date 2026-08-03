import * as React from "react";
import { useKelir } from "../KelirProvider";
import { InputGroupProps } from "../types";
import { InputGroup as NeumorphismInputGroup } from "../themes/neumorphism/input-group";

export function InputGroup(props: InputGroupProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismInputGroup {...props} />;
  }

  return null;
}
