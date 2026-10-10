import MuiTooltip from "@mui/material/Tooltip";
import type { TooltipProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Tooltip({
  title,
  children,
  id,
  "aria-label": ariaLabel,
}: TooltipProps) {
  return (
    <MuiTooltip
      title={title}
      arrow
      id={id}
      aria-label={ariaLabel}
      slotProps={{
        tooltip: {
          style: {
            backgroundColor: css.colors.surface,
            borderRadius: css.radius.sm,
            boxShadow: css.shadows.convex,
            border: `1px solid ${css.border.light}`,
            backdropFilter: css.motion.blur.backdrop,
            WebkitBackdropFilter: css.motion.blur.backdrop,
            color: css.colors.textPrimary,
            fontSize: "12px",
            fontFamily: "inherit",
          },
        },
        arrow: {
          style: {
            color: css.colors.surface,
          },
        },
      }}
    >
      {children}
    </MuiTooltip>
  );
}
