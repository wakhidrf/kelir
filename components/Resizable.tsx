import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ResizableProps } from "../types";
import { Resizable as NeumorphismResizable } from "../themes/neumorphism/resizable";

export function Resizable(props: ResizableProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismResizable {...props} />;
  }

  return null;
}
