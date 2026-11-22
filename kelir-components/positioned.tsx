import MuiBox from "@mui/material/Box";
import type { PositionedProps } from "../kelir-kit/kit-layout-shell";
import { css } from "../kelir-kit/kit-create-css";

// Kit mobile breakpoint (single source: the layout.mobile token, 600px).
const MOBILE_MAX = `@media (max-width: calc(${css.layout.breakpoints.mobile} - 0.02px))`;
const DESKTOP_MIN = `@media (min-width: ${css.layout.breakpoints.mobile})`;

// Kit-owned fixed anchor points: offsets from the space token (not arbitrary numbers).
const anchors = {
  "top-start": {
    top: css.layout.space.lg,
    left: css.layout.space.lg,
  },
  "top-center": {
    top: css.layout.space.lg,
    left: "50%",
    transform: "translateX(-50%)",
  },
  "top-end": {
    top: css.layout.space.lg,
    right: css.layout.space.lg,
  },
  "bottom-start": {
    bottom: css.layout.space.lg,
    left: css.layout.space.lg,
  },
  "bottom-center": {
    bottom: css.layout.space.lg,
    left: "50%",
    transform: "translateX(-50%)",
  },
  "bottom-end": {
    bottom: css.layout.space.lg,
    right: css.layout.space.lg,
  },
  "center-start": {
    top: `calc(50% - ${css.layout.space["2xl"]})`,
    left: css.layout.space.lg,
  },
} as const;

// Sealed fixed-position slot (STYLE.md §6): a theme/language trigger in a corner,
// a scroll-to-top trigger in the bottom corner, and a slide trigger at the left edge. `visibility?` picks mobile/desktop from the
// layout.mobile token; `elevate?` (default true) raises above content — turn it off
// when the container has its own sidebar trigger (z-index creates a stacking context
// that traps the drawer layer). No ...rest to the DOM and no style
// passthrough.
export function Positioned({
  children,
  anchor = "top-start",
  visibility = "always",
  elevate = true,
  id,
  "aria-label": ariaLabel,
}: PositionedProps) {
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={
        visibility === "always"
          ? undefined
          : visibility === "mobile"
            ? { [DESKTOP_MIN]: { display: "none" } }
            : { [MOBILE_MAX]: { display: "none" } }
      }
      style={{
        position: "fixed",
        ...anchors[anchor],
        ...(elevate ? { zIndex: Number(css.layout.zIndex.overlay) } : null),
      }}
    >
      {children}
    </MuiBox>
  );
}
