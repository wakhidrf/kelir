import * as React from "react";
import { useKelir } from "../KelirProvider";
import { NavigationMenuProps } from "../types";
import { NavigationMenu as NeumorphismNavigationMenu } from "../themes/neumorphism/navigation-menu";

export function NavigationMenu(props: NavigationMenuProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismNavigationMenu {...props} />;
  }

  return null;
}
