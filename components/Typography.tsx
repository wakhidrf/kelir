import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { TypographyProps } from "../types.js";
import { Typography as NeumorphismTypography } from "../themes/neumorphism/typography.js";

export function Typography(props: TypographyProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTypography {...props} />;
  }

  return null;
}
