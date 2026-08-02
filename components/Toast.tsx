import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { ToastProps } from "../types.js";
import { Toast as NeumorphismToast } from "../themes/neumorphism/toast.js";

export function Toast(props: ToastProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismToast {...props} />;
  }

  return null;
}
