import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { PopoverProps } from "../types.js";
import { Popover as NeumorphismPopover } from "../themes/neumorphism/popover.js";

export function Popover(props: PopoverProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismPopover {...props} />;
  }

  return null;
}
