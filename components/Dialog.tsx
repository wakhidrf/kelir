import * as React from "react";
import { useKelir } from "../KelirProvider";
import { DialogProps } from "../types";
import { Dialog as NeumorphismDialog } from "../themes/neumorphism/dialog";

export function Dialog(props: DialogProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDialog {...props} />;
  }

  return null;
}
