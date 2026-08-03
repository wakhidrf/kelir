import * as React from "react";
import { useKelir } from "../KelirProvider";
import { SkeletonProps } from "../types";
import { Skeleton as NeumorphismSkeleton } from "../themes/neumorphism/skeleton";

export function Skeleton(props: SkeletonProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismSkeleton {...props} />;
  }

  return null;
}
