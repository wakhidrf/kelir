import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { AvatarProps } from "../types.js";
import { Avatar as NeumorphismAvatar } from "../themes/neumorphism/avatar.js";

export function Avatar(props: AvatarProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismAvatar {...props} />;
  }

  return null;
}
