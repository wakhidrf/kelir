import * as React from "react";
import { useKelir } from "../KelirProvider";
import { AlertDialogProps } from "../types";
import { AlertDialog as NeumorphismAlertDialog } from "../themes/neumorphism/alert-dialog";

export function AlertDialog(props: AlertDialogProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAlertDialog {...props} />;
  }

  return null;
}
