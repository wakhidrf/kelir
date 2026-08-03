import * as React from "react";
import { useKelir } from "../KelirProvider";
import { AvatarProps } from "../types";
import { Avatar as NeumorphismAvatar } from "../themes/neumorphism/avatar";

export function Avatar(props: AvatarProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAvatar {...props} />;
  }

  return null;
}
