import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { FieldProps } from "../types.js";
import { Field as NeumorphismField } from "../themes/neumorphism/field.js";

export function Field(props: FieldProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismField {...props} />;
  }

  return null;
}
