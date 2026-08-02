import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { AccordionProps } from "../types.js";
import { Accordion as NeumorphismAccordion } from "../themes/neumorphism/accordion.js";

export function Accordion(props: AccordionProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAccordion {...props} />;
  }

  return null;
}
