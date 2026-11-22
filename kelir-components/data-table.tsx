"use client";

import * as React from "react";
import type { DataTableProps } from "../kelir-kit/kit-data-display-data";
import { DataTablePagination } from "./data-table-pagination";
import { TableHead } from "./data-table-head";
import { TableBody } from "./data-table-body";
import { TableContainer } from "./data-table-container";

export function DataTable({
  columns,
  data,
  paginated = false,
  rowsPerPage = 5,
  title,
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

  return (
    <div>
      <TableContainer title={title}>
        <TableHead columns={columns} />
        <TableBody columns={columns} visibleRows={visibleRows} rowKey={rowKey} />
      </TableContainer>
      {paginated && data.length > rowsPerPage && (
        <DataTablePagination
          page={safePage}
          pageCount={pageCount}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
