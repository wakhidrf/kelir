import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { DialogProps } from "../types.js";
import { Dialog as NeumorphismDialog } from "../themes/neumorphism/dialog.js";

export function Dialog(props: DialogProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDialog {...props} />;
  }

  return null;
}
