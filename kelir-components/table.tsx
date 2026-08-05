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

export function Table({ headers, rows, style, ...props }: TableProps) {
  return (
    <TableContainer
      style={{
        borderRadius: css.radius.sm,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        overflowX: "auto",
        fontFamily: "inherit",
        ...style,
      }}
    >
      <MuiTable
        {...props}
        sx={{
          minWidth: 650,
          "& .MuiTableCell-root": {
            fontFamily: "inherit",
            borderBottom: `1px solid ${css.divider}`,
            color: textPrimary,
          },
        }}
      >
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header}
                style={{ fontWeight: 700, color: textSecondary }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`row-${row.map(String).join("|")}`} hover>
              {row.map((cell) => (
                <TableCell
                  key={`cell-${String(cell)}`}
                  style={{ fontSize: "14px" }}
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
