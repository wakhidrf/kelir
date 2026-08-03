import * as React from "react";
import { useKelir } from "../KelirProvider";
import { TabsProps } from "../types";
import { Tabs as NeumorphismTabs } from "../themes/neumorphism/tabs";

export function Tabs(props: TabsProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTabs {...props} />;
  }

  return null;
}
