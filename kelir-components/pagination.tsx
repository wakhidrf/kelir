import MuiPagination from "@mui/material/Pagination";
import type { PaginationProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Pagination({ ...props }: PaginationProps) {
  return (
    <MuiPagination
      {...props}
      size="small"
      color="primary"
      style={{
        color: css.colors.primary,
        maxWidth: "100%",
        ...props.style,
      }}
      sx={{
        overflowX: "auto",
        "& .MuiPagination-ul": {
          flexWrap: "nowrap",
          justifyContent: "center",
        },
        "& .MuiPaginationItem-root": {
          fontFamily: "inherit",
        },
        ...props.sx,
      }}
    />
  );
}
