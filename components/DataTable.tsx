import * as React from "react";
import { useKelir } from "../KelirProvider";
import { DataTableProps } from "../types";
import { DataTable as NeumorphismDataTable } from "../themes/neumorphism/data-table";

export function DataTable(props: DataTableProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDataTable {...props} />;
  }

  return null;
}
