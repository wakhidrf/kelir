import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { NativeSelectProps } from "../types.js";
import { NativeSelect as NeumorphismNativeSelect } from "../themes/neumorphism/native-select.js";

export function NativeSelect(props: NativeSelectProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismNativeSelect {...props} />;
  }

  return null;
}
