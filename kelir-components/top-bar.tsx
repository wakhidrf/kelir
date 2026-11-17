import MuiBox from "@mui/material/Box";
import type { TopBarProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Sealed mobile app-shell bar (P1b STYLE.md): `left?`/`right?` slots are
// aligned edge-to-edge (an empty side = an invisible empty box;
// a single side still sits at its edge); `variant?` raised = a raised
// surface in the Kelir component style (surface + bottom border + shadow);
// flat = inline transparent with no surface (an action row within content).
// Header landmark. No custom color/border/shadow. No ...rest to the DOM
// and no style passthrough — outside the contract = violation.
export function TopBar({
  left,
  right,
  variant = "raised",
  id,
  "aria-label": ariaLabel,
}: TopBarProps) {
  const isFlat = variant === "flat";
  return (
    <MuiBox
      component="header"
      id={id}
      aria-label={ariaLabel}
      style={{
        display: "flex",
        alignItems: "center",
        gap: css.layout.space.md,
        padding: `${css.layout.space.sm} ${css.layout.space.md}`,
        backgroundColor: isFlat ? "transparent" : css.colors.surface,
        borderBottom: isFlat ? "none" : `1px solid ${css.border.light}`,
        boxShadow: isFlat ? "none" : css.shadows.convex,
        fontFamily: "inherit",
      }}
    >
      <MuiBox
        style={{
          display: "flex",
          alignItems: "center",
          gap: css.layout.space.sm,
          minWidth: 0,
        }}
      >
        {left}
      </MuiBox>
      <MuiBox
        style={{
          display: "flex",
          alignItems: "center",
          gap: css.layout.space.sm,
          minWidth: 0,
          marginLeft: "auto",
        }}
      >
        {right}
      </MuiBox>
    </MuiBox>
  );
}
