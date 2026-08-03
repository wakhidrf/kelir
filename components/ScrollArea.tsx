import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ScrollAreaProps } from "../types";
import { ScrollArea as NeumorphismScrollArea } from "../themes/neumorphism/scroll-area";

export function ScrollArea(props: ScrollAreaProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismScrollArea {...props} />;
  }

  return null;
}
