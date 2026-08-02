import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ContextMenuProps } from "../types.js";
import { ContextMenu as NeumorphismContextMenu } from "../themes/neumorphism/context-menu.js";

export function ContextMenu(props: ContextMenuProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismContextMenu {...props} />;
  }

  return null;
}
