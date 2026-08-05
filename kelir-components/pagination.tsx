import MuiPagination from "@mui/material/Pagination";
import type { PaginationProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Pagination({ ...props }: PaginationProps) {
  return (
    <MuiPagination
      {...props}
      color="primary"
      style={{
        color: css.colors.primary,
        ...props.style,
      }}
      sx={{
        "& .MuiPaginationItem-root": {
          fontFamily: "inherit",
        },
      }}
    />
  );
}
