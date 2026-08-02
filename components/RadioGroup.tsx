import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { RadioGroupProps } from "../types.js";
import { RadioGroup as NeumorphismRadioGroup } from "../themes/neumorphism/radio-group.js";

export function RadioGroup(props: RadioGroupProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismRadioGroup {...props} />;
  }

  return null;
}
