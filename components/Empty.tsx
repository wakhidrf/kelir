import * as React from "react";
import { useKelir } from "../KelirProvider";
import { EmptyProps } from "../types";
import { Empty as NeumorphismEmpty } from "../themes/neumorphism/empty";

export function Empty(props: EmptyProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismEmpty {...props} />;
  }

  return null;
}
