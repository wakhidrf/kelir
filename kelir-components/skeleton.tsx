import MuiSkeleton from "@mui/material/Skeleton";
import type { SkeletonProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Skeleton({
  variant = "text",
  width,
  height,
  animation = "pulse",
  id,
  "aria-label": ariaLabel,
}: SkeletonProps) {
  return (
    <MuiSkeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      id={id}
      aria-label={ariaLabel}
      sx={{
        backgroundColor: css.track,
        borderRadius: variant === "circular" ? undefined : css.radius.card,
      }}
    />
  );
}
