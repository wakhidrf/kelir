import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { AlertDialogProps } from "../types.js";
import { AlertDialog as NeumorphismAlertDialog } from "../themes/neumorphism/alert-dialog.js";

export function AlertDialog(props: AlertDialogProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAlertDialog {...props} />;
  }

  return null;
}
