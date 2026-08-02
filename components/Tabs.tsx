import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { TabsProps } from "../types.js";
import { Tabs as NeumorphismTabs } from "../themes/neumorphism/tabs.js";

export function Tabs(props: TabsProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTabs {...props} />;
  }

  return null;
}
