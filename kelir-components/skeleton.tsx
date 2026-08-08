import MuiSkeleton from "@mui/material/Skeleton";
import type { SkeletonProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Skeleton({ ...props }: SkeletonProps) {
  return (
    <MuiSkeleton
      {...props}
      style={{
        backgroundColor: css.track,
        borderRadius: css.radius.sm,
        ...props.style,
      }}
    />
  );
}
