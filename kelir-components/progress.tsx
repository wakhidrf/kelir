import MuiLinearProgress from "@mui/material/LinearProgress";
import type { ProgressProps } from "../kelir-kit/kit-feedback";
import { css } from "../kelir-kit/kit-create-css";

export function Progress({
  value,
  variant = "determinate",
  id,
  "aria-label": ariaLabel,
}: ProgressProps) {
  return (
    <MuiLinearProgress
      variant={variant}
      value={value}
      id={id}
      aria-label={ariaLabel}
      sx={{
        borderRadius: "999px",
        height: "10px",
        backgroundColor: css.divider,
        boxShadow: `inset 1px 1px 3px ${css.track}`,
        "& .MuiLinearProgress-bar": {
          backgroundColor: css.colors.primary,
          borderRadius: "999px",
        },
      }}
    />
  );
}
