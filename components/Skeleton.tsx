import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { SkeletonProps } from "../types.js";
import { Skeleton as NeumorphismSkeleton } from "../themes/neumorphism/skeleton.js";

export function Skeleton(props: SkeletonProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSkeleton {...props} />;
  }

  return null;
}
