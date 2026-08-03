import * as React from "react";
import { useKelir } from "../KelirProvider";
import { RadioGroupProps } from "../types";
import { RadioGroup as NeumorphismRadioGroup } from "../themes/neumorphism/radio-group";

export function RadioGroup(props: RadioGroupProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismRadioGroup {...props} />;
  }

  return null;
}
