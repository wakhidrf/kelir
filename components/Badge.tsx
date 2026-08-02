import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { BadgeProps } from "../types.js";
import { Badge as NeumorphismBadge } from "../themes/neumorphism/badge.js";

export function Badge(props: BadgeProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismBadge {...props} />;
  }

  return null;
}
