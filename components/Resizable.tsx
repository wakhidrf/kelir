import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ResizableProps } from "../types.js";
import { Resizable as NeumorphismResizable } from "../themes/neumorphism/resizable.js";

export function Resizable(props: ResizableProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismResizable {...props} />;
  }

  return null;
}
