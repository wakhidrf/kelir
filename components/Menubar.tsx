import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { MenubarProps } from "../types.js";
import { Menubar as NeumorphismMenubar } from "../themes/neumorphism/menubar.js";

export function Menubar(props: MenubarProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismMenubar {...props} />;
  }

  return null;
}
