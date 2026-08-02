import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { NavigationMenuProps } from "../types.js";
import { NavigationMenu as NeumorphismNavigationMenu } from "../themes/neumorphism/navigation-menu.js";

export function NavigationMenu(props: NavigationMenuProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismNavigationMenu {...props} />;
  }

  return null;
}
