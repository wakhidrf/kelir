import * as React from "react";
import { useKelir } from "../KelirProvider";
import { PaginationProps } from "../types";
import { Pagination as NeumorphismPagination } from "../themes/neumorphism/pagination";

export function Pagination(props: PaginationProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismPagination {...props} />;
  }

  return null;
}
