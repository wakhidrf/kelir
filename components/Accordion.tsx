import * as React from "react";
import { useKelir } from "../KelirProvider";
import { AccordionProps } from "../types";
import { Accordion as NeumorphismAccordion } from "../themes/neumorphism/accordion";

export function Accordion(props: AccordionProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAccordion {...props} />;
  }

  return null;
}
