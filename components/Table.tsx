import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { TableProps } from "../types.js";
import { Table as NeumorphismTable } from "../themes/neumorphism/table.js";

export function Table(props: TableProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTable {...props} />;
  }

  return null;
}
