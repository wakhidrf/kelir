import * as React from "react";
import { useKelir } from "../KelirProvider";
import { MessageScrollerProps } from "../types";
import { MessageScroller as NeumorphismMessageScroller } from "../themes/neumorphism/message-scroller";

export function MessageScroller(props: MessageScrollerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismMessageScroller {...props} />;
  }

  return null;
}
