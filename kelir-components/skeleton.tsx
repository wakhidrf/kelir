import MuiSkeleton from "@mui/material/Skeleton";
import type { SkeletonProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Skeleton({ ...props }: SkeletonProps) {
  return (
    <MuiSkeleton
      {...props}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: css.radius.sm,
        ...props.style,
      }}
    />
  );
}
