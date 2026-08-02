import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { AlertProps } from "../types.js";
import { Alert as NeumorphismAlert } from "../themes/neumorphism/alert.js";

export function Alert(props: AlertProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAlert {...props} />;
  }

  return null;
}
