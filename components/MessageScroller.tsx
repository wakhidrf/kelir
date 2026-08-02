import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { MessageScrollerProps } from "../types.js";
import { MessageScroller as NeumorphismMessageScroller } from "../themes/neumorphism/message-scroller.js";

export function MessageScroller(props: MessageScrollerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismMessageScroller {...props} />;
  }

  return null;
}
