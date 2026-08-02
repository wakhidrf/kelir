import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ItemProps } from "../types.js";
import { Item as NeumorphismItem } from "../themes/neumorphism/item.js";

export function Item(props: ItemProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismItem {...props} />;
  }

  return null;
}
