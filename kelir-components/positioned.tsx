import MuiBox from "@mui/material/Box";
import type { PositionedProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Ambang ponsel kit (satu sumber: token layout.mobile 600px).
const MOBILE_MAX = `@media (max-width: calc(${css.layout.breakpoints.mobile} - 0.02px))`;
const DESKTOP_MIN = `@media (min-width: ${css.layout.breakpoints.mobile})`;

// Titik tetap milik kit: offset dari token space (bukan angka bebas).
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
  "center-start": {
    top: `calc(50% - ${css.layout.space["2xl"]})`,
    left: css.layout.space.lg,
  },
} as const;

// Slot bertitik tetap sealed (STYLE.md §6): pemicu tema/bahasa di sudut dan
// pemicu geser di tepi kiri. `visibility?` memilih ponsel/desktop dari token
// layout.mobile; `elevate?` (bawaan true) menaikkan di atas konten — matikan
// bila wadah memuat pemicu sidebar sendiri (z-index membuat stacking context
// yang menjebak lapisan drawer). Tanpa ...rest ke DOM dan tanpa style
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
