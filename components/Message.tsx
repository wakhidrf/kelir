import * as React from "react";
import { useKelir } from "../KelirProvider";
import { MessageProps } from "../types";
import { Message as NeumorphismMessage } from "../themes/neumorphism/message";

export function Message(props: MessageProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismMessage {...props} />;
  }

  return null;
}
