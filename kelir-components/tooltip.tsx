import MuiTooltip from "@mui/material/Tooltip";
import type * as React from "react";
import type { TooltipProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

type SlotStyle = { style?: React.CSSProperties };

export function Tooltip({ children, ...props }: TooltipProps) {
  const tooltipSlot = props.slotProps?.tooltip as SlotStyle | undefined;
  const arrowSlot = props.slotProps?.arrow as SlotStyle | undefined;

  return (
    <MuiTooltip
      {...props}
      slotProps={{
        ...props.slotProps,
        tooltip: {
          ...(tooltipSlot ?? {}),
          style: {
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.sm,
            boxShadow: convexShadow,
            border: `1px solid ${css.border.light}`,
            color: textPrimary,
            fontSize: "12px",
            fontFamily: "inherit",
            ...tooltipSlot?.style,
          },
        },
        arrow: {
          ...(arrowSlot ?? {}),
          style: {
            color: neumorphicBg,
            ...arrowSlot?.style,
          },
        },
      }}
    >
      {children}
    </MuiTooltip>
  );
}
