import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { DropdownMenuProps } from "../types.js";
import { DropdownMenu as NeumorphismDropdownMenu } from "../themes/neumorphism/dropdown-menu.js";

export function DropdownMenu(props: DropdownMenuProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDropdownMenu {...props} />;
  }

  return null;
}
