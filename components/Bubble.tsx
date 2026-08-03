import * as React from "react";
import { useKelir } from "../KelirProvider";
import { BubbleProps } from "../types";
import { Bubble as NeumorphismBubble } from "../themes/neumorphism/bubble";

export function Bubble(props: BubbleProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismBubble {...props} />;
  }

  return null;
}
