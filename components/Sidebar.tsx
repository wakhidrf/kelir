import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { SidebarProps } from "../types.js";
import { Sidebar as NeumorphismSidebar } from "../themes/neumorphism/sidebar.js";

export function Sidebar(props: SidebarProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSidebar {...props} />;
  }

  return null;
}
