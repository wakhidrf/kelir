import MuiBox from "@mui/material/Box";
import type { TileProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Kit-owned fixed sizes (aligned with Image sm/md/lg heights); without `size` =
// flexible icon tile (padding token).
const sizes = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
  "2xl": 96,
  "3xl": 128,
} as const;

// Sealed icon/logo tile (P1b STYLE.md): `tone?` MEANING (background + text from
// tokens; plain = surface + light border so it reads on top of surface).
// Token radius (sm ≈ the original IconTile's 10 px, now theme-owned); no shadow.
// MUI base (MuiBox) so it stays in the theme tree. No ...rest to the DOM and no
// style passthrough — outside the contract = violation.
export function Tile({
  children,
  tone = "primary",
  size,
  id,
  "aria-label": ariaLabel,
}: TileProps) {
  const palette =
    tone === "primary"
      ? { bg: css.colors.primary, fg: css.on.primary }
      : tone === "secondary"
        ? { bg: css.colors.secondary, fg: css.on.secondary }
        : { bg: css.colors.surface, fg: css.colors.textPrimary };
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: size ? 0 : css.layout.space.sm,
        ...(size
          ? ({
              width: sizes[size],
              height: sizes[size],
              flexShrink: 0,
              overflow: "hidden",
            } as const)
          : null),
        borderRadius: css.radius.sm,
        backgroundColor: palette.bg,
        color: palette.fg,
        ...(tone === "plain"
          ? { border: `1px solid ${css.border.light}` }
          : null),
        fontFamily: "inherit",
      }}
    >
      {children}
    </MuiBox>
  );
}
