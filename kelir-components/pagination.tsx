import MuiPagination from "@mui/material/Pagination";
import type { PaginationProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Pagination({
  count,
  page,
  defaultPage,
  onChange,
  disabled,
  id,
  "aria-label": ariaLabel,
}: PaginationProps) {
  return (
    <MuiPagination
      count={count}
      page={page}
      defaultPage={defaultPage}
      onChange={(_e, next) => onChange?.(next)}
      disabled={disabled}
      size="small"
      color="primary"
      aria-label={ariaLabel}
      sx={{
        color: css.colors.primary,
        maxWidth: "100%",
        overflowX: "auto",
        "& .MuiPagination-ul": {
          flexWrap: "nowrap",
          justifyContent: "center",
        },
        "& .MuiPaginationItem-root": {
          fontFamily: "inherit",
        },
      }}
    />
  );
}
