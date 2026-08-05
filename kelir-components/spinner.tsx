import MuiCircularProgress from "@mui/material/CircularProgress";
import type { SpinnerProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Spinner({ ...props }: SpinnerProps) {
  return (
    <MuiCircularProgress
      {...props}
      style={{
        color: css.colors.primary,
        ...props.style,
      }}
    />
  );
}
