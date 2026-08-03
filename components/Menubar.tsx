import * as React from "react";
import { useKelir } from "../KelirProvider";
import { MenubarProps } from "../types";
import { Menubar as NeumorphismMenubar } from "../themes/neumorphism/menubar";

export function Menubar(props: MenubarProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismMenubar {...props} />;
  }

  return null;
}
