import MuiCircularProgress from "@mui/material/CircularProgress";
import type { SpinnerProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Ukuran milik kit (px tertutup, bukan angka bebas konsumen).
const sizes = { small: 16, medium: 24, large: 40 } as const;

// Indikator loading sealed (P1c STYLE.md §6): basis MUI untuk
// multi-platform; indeterminate + warna primer milik kit — tanpa ...rest,
// tanpa style/sx/className/value/variant konsumen.
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
