import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { EmptyProps } from "../types.js";
import { Empty as NeumorphismEmpty } from "../themes/neumorphism/empty.js";

export function Empty(props: EmptyProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismEmpty {...props} />;
  }

  return null;
}
