import MuiCircularProgress from "@mui/material/CircularProgress";
import type { SpinnerProps } from "../kelir-kit/kit-feedback";
import { css } from "../kelir-kit/kit-create-css";

// Kit-owned sizes (closed px values, not free consumer numbers).
const sizes = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 56,
  "2xl": 72,
  "3xl": 96,
} as const;

// Sealed loading indicator (P1c STYLE.md §6): MUI base for
// multi-platform; indeterminate + primary color owned by the kit — no ...rest,
// no consumer style/sx/className/value/variant.
export function Spinner({
  size = "md",
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
