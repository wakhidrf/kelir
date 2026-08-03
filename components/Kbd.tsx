import * as React from "react";
import { useKelir } from "../KelirProvider";
import { KbdProps } from "../types";
import { Kbd as NeumorphismKbd } from "../themes/neumorphism/kbd";

export function Kbd(props: KbdProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismKbd {...props} />;
  }

  return null;
}
