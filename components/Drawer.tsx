import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { DrawerProps } from "../types.js";
import { Drawer as NeumorphismDrawer } from "../themes/neumorphism/drawer.js";

export function Drawer(props: DrawerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDrawer {...props} />;
  }

  return null;
}
