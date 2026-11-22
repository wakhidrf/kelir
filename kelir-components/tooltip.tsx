import MuiTooltip from "@mui/material/Tooltip";
import type { TooltipProps } from "../kelir-kit/kit-typography-props";
import { css } from "../kelir-kit/kit-create-css";

export function Tooltip({
  title,
  children,
  id,
  "aria-label": ariaLabel,
}: TooltipProps) {
  // Custom children (e.g. a Kelir Button, sealed with no ...rest) don't forward
  // the ref + hover/focus handlers that MUI injects via clone — so the tooltip
  // never opens. Wrap in a kit-owned host span (the MUI-recommended pattern): the anchor
  // + handlers attach to the span, the child renders as-is. A host element
  // (e.g. a native <button>) is passed through directly without a wrapper.
  const trigger =
    typeof children.type === "string" ? (
      children
    ) : (
      <span style={{ display: "inline-flex" }}>{children}</span>
    );
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
            borderRadius: css.radius.surface,
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
      {trigger}
    </MuiTooltip>
  );
}
