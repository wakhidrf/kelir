import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ButtonProps } from "../types.js";
import { Button as NeumorphismButton } from "../themes/neumorphism/button.js";

export function Button(props: ButtonProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismButton {...props} />;
  }

  return null;
}
