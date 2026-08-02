import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ScrollAreaProps } from "../types.js";
import { ScrollArea as NeumorphismScrollArea } from "../themes/neumorphism/scroll-area.js";

export function ScrollArea(props: ScrollAreaProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismScrollArea {...props} />;
  }

  return null;
}
