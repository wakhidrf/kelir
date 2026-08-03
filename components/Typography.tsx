import * as React from "react";
import { useKelir } from "../KelirProvider";
import { TypographyProps } from "../types";
import { Typography as NeumorphismTypography } from "../themes/neumorphism/typography";

export function Typography(props: TypographyProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTypography {...props} />;
  }

  return null;
}
