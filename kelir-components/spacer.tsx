import MuiBox from "@mui/material/Box";
import type { SpacerProps } from "../kelir-types";
import { css } from "../kelir-variants";

const sizes = {
  xs: css.layout.space.xs,
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
} as const;

// Semantic vertical spacing (P1b STYLE.md). Presentational: aria-hidden.
// Size is a closed union from the css.layout.space token. MUI base (MuiBox)
// for multi-platform. No ...rest to the DOM.
export function Spacer({ size = "md", id }: SpacerProps) {
  return (
    <MuiBox
      id={id}
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: sizes[size],
        flexShrink: 0,
      }}
    />
  );
}
