import MuiBox from "@mui/material/Box";
import type { CardProps } from "../kelir-kit/kit-data-display-content";
import { css } from "../kelir-kit/kit-create-css";
 import { statusColors } from "../kelir-kit/kit-variant-values";

// Kit-owned side strip (solid, Marker-border precedent): token breathing width.
const flagColors = {
  error: css.destructive,
  warning: statusColors.warning.bg,
} as const;

// Card side flag (internal): absolute status strip whose corners inherit the
// card radius.
export function CardFlag({ flag }: { flag: NonNullable<CardProps["flag"]> }) {
  return (
    <MuiBox
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: css.layout.space.xs,
        backgroundColor: flagColors[flag],
        borderTopLeftRadius: "inherit",
        borderBottomLeftRadius: "inherit",
      }}
    />
  );
}