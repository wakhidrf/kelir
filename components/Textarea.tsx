import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { TextareaProps } from "../types.js";
import { Textarea as NeumorphismTextarea } from "../themes/neumorphism/textarea.js";

export function Textarea(props: TextareaProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTextarea {...props} />;
  }

  return null;
}
