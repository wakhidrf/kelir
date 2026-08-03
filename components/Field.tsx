import * as React from "react";
import { useKelir } from "../KelirProvider";
import { FieldProps } from "../types";
import { Field as NeumorphismField } from "../themes/neumorphism/field";

export function Field(props: FieldProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismField {...props} />;
  }

  return null;
}
