import * as React from "react";
import { useKelir } from "../KelirProvider";
import { TableProps } from "../types";
import { Table as NeumorphismTable } from "../themes/neumorphism/table";

export function Table(props: TableProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismTable {...props} />;
  }

  return null;
}
