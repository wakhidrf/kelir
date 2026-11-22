"use client";

import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import MuiTableCell from "@mui/material/TableCell";
import type { DataTableProps } from "../kelir-kit/kit-data-display-data";
import { css } from "../kelir-kit/kit-create-css";

const textSecondary = css.colors.textSecondary;

export function TableHead({
  columns,
}: {
  columns: DataTableProps["columns"];
}) {
  return (
    <MuiTableHead>
      <MuiTableRow>
        {columns.map((col) => (
          <MuiTableCell
            key={col.accessorKey}
            style={{
              color: textSecondary,
              fontWeight: 700,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: `1px solid ${css.divider}`,
              fontFamily: "inherit",
            }}
          >
            {col.header}
          </MuiTableCell>
        ))}
      </MuiTableRow>
    </MuiTableHead>
  );
}