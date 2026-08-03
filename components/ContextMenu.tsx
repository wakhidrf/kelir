import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ContextMenuProps } from "../types";
import { ContextMenu as NeumorphismContextMenu } from "../themes/neumorphism/context-menu";

export function ContextMenu(props: ContextMenuProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismContextMenu {...props} />;
  }

  return null;
}
