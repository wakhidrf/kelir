import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { InputProps } from "../types.js";
import { Input as NeumorphismInput } from "../themes/neumorphism/input.js";

export function Input(props: InputProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismInput {...props} />;
  }

  return null;
}
