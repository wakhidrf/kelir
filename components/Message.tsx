import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { MessageProps } from "../types.js";
import { Message as NeumorphismMessage } from "../themes/neumorphism/message.js";

export function Message(props: MessageProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismMessage {...props} />;
  }

  return null;
}
