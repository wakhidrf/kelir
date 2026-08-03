import * as React from "react";
import { useKelir } from "../KelirProvider";
import { InputProps } from "../types";
import { Input as NeumorphismInput } from "../themes/neumorphism/input";

export function Input(props: InputProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismInput {...props} />;
  }

  return null;
}
