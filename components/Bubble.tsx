import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { BubbleProps } from "../types.js";
import { Bubble as NeumorphismBubble } from "../themes/neumorphism/bubble.js";

export function Bubble(props: BubbleProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismBubble {...props} />;
  }

  return null;
}
