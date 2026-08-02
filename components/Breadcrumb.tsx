import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { BreadcrumbProps } from "../types.js";
import { Breadcrumb as NeumorphismBreadcrumb } from "../themes/neumorphism/breadcrumb.js";

export function Breadcrumb(props: BreadcrumbProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismBreadcrumb {...props} />;
  }

  return null;
}
