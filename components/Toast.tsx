import * as React from "react";
import { useKelir } from "../KelirProvider";
import { ToastProps } from "../types";
import { Toast as NeumorphismToast } from "../themes/neumorphism/toast";

export function Toast(props: ToastProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismToast {...props} />;
  }

  return null;
}
