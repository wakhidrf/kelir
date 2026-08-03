import * as React from "react";
import { useKelir } from "../KelirProvider";
import { DrawerProps } from "../types";
import { Drawer as NeumorphismDrawer } from "../themes/neumorphism/drawer";

export function Drawer(props: DrawerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDrawer {...props} />;
  }

  return null;
}
