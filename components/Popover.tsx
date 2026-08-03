import * as React from "react";
import { useKelir } from "../KelirProvider";
import { PopoverProps } from "../types";
import { Popover as NeumorphismPopover } from "../themes/neumorphism/popover";

export function Popover(props: PopoverProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismPopover {...props} />;
  }

  return null;
}
