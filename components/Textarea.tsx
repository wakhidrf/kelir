import * as React from "react";
import { useKelir } from "../KelirProvider";
import { TextareaProps } from "../types";
import { Textarea as NeumorphismTextarea } from "../themes/neumorphism/textarea";

export function Textarea(props: TextareaProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTextarea {...props} />;
  }

  return null;
}
