import MuiCircularProgress from "@mui/material/CircularProgress";
import type { SpinnerProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Kit-owned sizes (closed px values, not free consumer numbers).
const sizes = { small: 16, medium: 24, large: 40 } as const;

// Sealed loading indicator (P1c STYLE.md §6): MUI base for
// multi-platform; indeterminate + primary color owned by the kit — no ...rest,
// no consumer style/sx/className/value/variant.
export function Spinner({
  size = "medium",
  id,
  "aria-label": ariaLabel,
}: SpinnerProps) {
  return (
    <MuiCircularProgress
      size={sizes[size]}
      id={id}
      aria-label={ariaLabel}
      style={{
        color: css.colors.primary,
      }}
    />
  );
}
