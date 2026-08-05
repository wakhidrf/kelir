import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import * as React from "react";
import type { DataTableProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function DataTable({
  columns,
  data,
  paginated = false,
  rowsPerPage = 5,
  ...props
}: DataTableProps) {
  const [page, setPage] = React.useState(0);
  const pageCount = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * rowsPerPage;
  const visibleRows = paginated ? data.slice(start, start + rowsPerPage) : data;

  const rowKey = (row: unknown) =>
    columns
      .map((col) =>
        String((row as Record<string, unknown>)[col.accessorKey] ?? ""),
      )
      .join("|");

  const pageButtonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    border: `1px solid ${css.border.light}`,
    borderRadius: css.radius.sm,
    backgroundColor: neumorphicBg,
    color: textPrimary,
    boxShadow: convexShadow,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
    fontSize: "12px",
    fontWeight: 600,
    transition: "all 150ms ease-out",
  });

  return (
    <div
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        overflow: "hidden",
        fontFamily: "inherit",
      }}
    >
      <MuiTable {...props}>
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
      </MuiTable>
      {paginated && data.length > rowsPerPage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderTop: `1px solid ${css.divider}`,
          }}
        >
          <span style={{ fontSize: "12px", color: textSecondary }}>
            Page {safePage + 1} of {pageCount}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              style={pageButtonStyle(safePage === 0)}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              style={pageButtonStyle(safePage >= pageCount - 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
