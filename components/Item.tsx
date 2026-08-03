import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ItemProps } from "../types";
import { Item as NeumorphismItem } from "../themes/neumorphism/item";

export function Item(props: ItemProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismItem {...props} />;
  }

  return null;
}
