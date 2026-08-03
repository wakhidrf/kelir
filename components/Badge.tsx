import * as React from "react";
import { useKelir } from "../KelirProvider";
import { BadgeProps } from "../types";
import { Badge as NeumorphismBadge } from "../themes/neumorphism/badge";

export function Badge(props: BadgeProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismBadge {...props} />;
  }

  return null;
}
