import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { CommandProps } from "../types.js";
import { Command as NeumorphismCommand } from "../themes/neumorphism/command.js";

export function Command(props: CommandProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCommand {...props} />;
  }

  return null;
}
