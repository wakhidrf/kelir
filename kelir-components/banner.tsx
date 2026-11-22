import MuiBox from "@mui/material/Box";
import type { BannerProps } from "../kelir-kit/kit-misc-misc";
import { css } from "../kelir-kit/kit-create-css";
 import { statusColors } from "../kelir-kit/kit-variant-values";

// Kit-owned bg/fg pairs (Marker-note precedent: solid, not raw colors).
// `neutral` = token gray (Alert has no neutral tone).
const bannerPalettes = {
  error: { bg: css.destructive, fg: css.on.destructive },
  warning: statusColors.warning,
  neutral: { bg: css.colors.neutral, fg: css.colors.surface },
} as const;

// Centered status banner sealed (P1b STYLE.md): child text inherits the color
// (no inner overrides); centered; no icon (that's `Alert`).
// MUI-based (MuiBox) so it's in the theme tree. No ...rest to the DOM and no
// style passthrough - out of contract = violation.
export function Banner({
  children,
  tone = "neutral",
  id,
  "aria-label": ariaLabel,
}: BannerProps) {
  const palette = bannerPalettes[tone];
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        textAlign: "center",
        padding: css.layout.space.md,
        borderRadius: css.radius.sm,
        backgroundColor: palette.bg,
        color: palette.fg,
        fontFamily: "inherit",
      }}
    >
      {children}
    </MuiBox>
  );
}
