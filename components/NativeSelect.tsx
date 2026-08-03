import * as React from "react";
import { useKelir } from "../KelirProvider";
import { NativeSelectProps } from "../types";
import { NativeSelect as NeumorphismNativeSelect } from "../themes/neumorphism/native-select";

export function NativeSelect(props: NativeSelectProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismNativeSelect {...props} />;
  }

  return null;
}
