import * as React from "react";
import { useKelir } from "../KelirProvider";
import { SidebarProps } from "../types";
import { Sidebar as NeumorphismSidebar } from "../themes/neumorphism/sidebar";

export function Sidebar(props: SidebarProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSidebar {...props} />;
  }

  return null;
}
