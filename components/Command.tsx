import * as React from "react";
import { useKelir } from "../KelirProvider";
import { CommandProps } from "../types";
import { Command as NeumorphismCommand } from "../themes/neumorphism/command";

export function Command(props: CommandProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCommand {...props} />;
  }

  return null;
}
