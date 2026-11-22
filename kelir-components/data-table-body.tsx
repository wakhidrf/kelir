"use client";

import MuiTableBody from "@mui/material/TableBody";
import MuiTableRow from "@mui/material/TableRow";
import MuiTableCell from "@mui/material/TableCell";
import type { DataTableProps } from "../kelir-kit/kit-data-display-data";
import { css } from "../kelir-kit/kit-create-css";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function TableBody({
  columns,
  visibleRows,
  rowKey,
}: {
  columns: DataTableProps["columns"];
  visibleRows: DataTableProps["data"];
  rowKey: (row: unknown) => string;
}) {
  return (
    <MuiTableBody>
      {visibleRows.map((row) => (
        <MuiTableRow key={`row-${rowKey(row)}`}>
          {columns.map((col) => {
            const value = (row as Record<string, unknown>)[col.accessorKey];
            return (
              <MuiTableCell
                key={col.accessorKey}
                style={{
                  color: textPrimary,
                  fontSize: "14px",
                  borderBottom: `1px solid ${css.divider}`,
                  fontFamily: "inherit",
                }}
              >
                {String(value ?? "")}
              </MuiTableCell>
            );
          })}
        </MuiTableRow>
      ))}
      {visibleRows.length === 0 && (
        <MuiTableRow>
          <MuiTableCell
            colSpan={columns.length}
            align="center"
            style={{
              color: textSecondary,
              fontSize: "14px",
              borderBottom: "none",
            }}
          >
            No data
          </MuiTableCell>
        </MuiTableRow>
      )}
    </MuiTableBody>
  );
}