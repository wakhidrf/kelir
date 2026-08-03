import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ButtonProps } from "../types";
import { Button as NeumorphismButton } from "../themes/neumorphism/button";

export function Button(props: ButtonProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismButton {...props} />;
  }

  return null;
}
