import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { TableProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Satu tingkat lebih rapat: dipakai tabel padat (banyak kolom) tanpa mengubah
// token warna/anti-aliasing kit. Ukuran rujukan: timeline penjadwalan audit
// SIGAP (6 kolom, terbaca di desktop dan ponsel).
const DENSITY = {
  default: { cell: "14px", head: "14px", pad: "16px" },
  compact: { cell: "12px", head: "11px", pad: "8px 12px" },
} as const;

export function Table<TCell extends React.ReactNode = React.ReactNode>({
  headers,
  rows,
  density = "default",
}: TableProps<TCell>) {
  const sizes = DENSITY[density];
  return (
    <TableContainer
      style={{
        borderRadius: css.radius.card,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        backgroundColor: css.colors.surface,
        overflowX: "auto",
        fontFamily: "inherit",
      }}
    >
      <MuiTable
        sx={{
          minWidth: density === "compact" ? 600 : 650,
          "& .MuiTableCell-root": {
            fontFamily: "inherit",
            borderBottom: `1px solid ${css.divider}`,
            color: textPrimary,
            padding: sizes.pad,
          },
        }}
      >
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header}
                style={{
                  fontWeight: 700,
                  color: textSecondary,
                  fontSize: sizes.head,
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={`row-${rowIndex}`} hover>
              {row.map((cell, cellIndex) => (
                <TableCell
                  key={`cell-${rowIndex}-${cellIndex}`}
                  style={{ fontSize: sizes.cell }}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
