import * as React from "react";
import { useKelir } from "../KelirProvider";
import { BreadcrumbProps } from "../types";
import { Breadcrumb as NeumorphismBreadcrumb } from "../themes/neumorphism/breadcrumb";

export function Breadcrumb(props: BreadcrumbProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismBreadcrumb {...props} />;
  }

  return null;
}
