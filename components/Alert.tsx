import * as React from "react";
import { useKelir } from "../KelirProvider";
import { AlertProps } from "../types";
import { Alert as NeumorphismAlert } from "../themes/neumorphism/alert";

export function Alert(props: AlertProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAlert {...props} />;
  }

  return null;
}
