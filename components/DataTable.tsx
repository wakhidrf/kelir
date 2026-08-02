import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { DataTableProps } from "../types.js";
import { DataTable as NeumorphismDataTable } from "../themes/neumorphism/data-table.js";

export function DataTable(props: DataTableProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDataTable {...props} />;
  }

  return null;
}
