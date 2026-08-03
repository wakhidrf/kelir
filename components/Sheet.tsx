import * as React from "react";
import { useKelir } from "../KelirProvider";
import { SheetProps } from "../types";
import { Sheet as NeumorphismSheet } from "../themes/neumorphism/sheet";

export function Sheet(props: SheetProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSheet {...props} />;
  }

  return null;
}
