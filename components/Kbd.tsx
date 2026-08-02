import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { KbdProps } from "../types.js";
import { Kbd as NeumorphismKbd } from "../themes/neumorphism/kbd.js";

export function Kbd(props: KbdProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismKbd {...props} />;
  }

  return null;
}
