import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { PaginationProps } from "../types.js";
import { Pagination as NeumorphismPagination } from "../themes/neumorphism/pagination.js";

export function Pagination(props: PaginationProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismPagination {...props} />;
  }

  return null;
}
