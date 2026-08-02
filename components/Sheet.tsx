import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { SheetProps } from "../types.js";
import { Sheet as NeumorphismSheet } from "../themes/neumorphism/sheet.js";

export function Sheet(props: SheetProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSheet {...props} />;
  }

  return null;
}
