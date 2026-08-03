import * as React from "react";
import { useKelir } from "../KelirProvider";
import { DropdownMenuProps } from "../types";
import { DropdownMenu as NeumorphismDropdownMenu } from "../themes/neumorphism/dropdown-menu";

export function DropdownMenu(props: DropdownMenuProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDropdownMenu {...props} />;
  }

  return null;
}
