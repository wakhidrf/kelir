import MuiLinearProgress from "@mui/material/LinearProgress";
import type { ProgressProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Progress({ ...props }: ProgressProps) {
  return (
    <MuiLinearProgress
      {...props}
      style={{
        borderRadius: "999px",
        height: "10px",
        backgroundColor: css.divider,
        boxShadow: `inset 1px 1px 3px ${css.track}`,
        ...props.style,
      }}
      sx={{
        "& .MuiLinearProgress-bar": {
          backgroundColor: css.colors.primary,
          borderRadius: "999px",
        },
      }}
    />
  );
}
