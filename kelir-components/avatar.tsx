import MuiAvatar from "@mui/material/Avatar";
import type { AvatarProps } from "../kelir-types";
import { css } from "../kelir-variants";

const AVATAR_PX = {
  small: 32,
  medium: 40,
  large: 48,
  xl: 96,
  "2xl": 128,
  "3xl": 160,
} as const;

// Logika murni (bukan DOM): peta size MAKNA → px milik kit.
// Diuji unit langsung — jsdom tak menghitung stylesheet emotion.
export function avatarPx(size: NonNullable<AvatarProps["size"]>): number {
  return AVATAR_PX[size];
}

export function Avatar({
  src,
  alt,
  fallbackText,
  size = "medium",
  frame = false,
  id,
  "aria-label": ariaLabel,
}: AvatarProps) {
  const px = avatarPx(size);
  return (
    <MuiAvatar
      src={src}
      alt={alt ?? fallbackText}
      id={id}
      aria-label={ariaLabel ?? (src ? undefined : fallbackText)}
      sx={{
        width: px,
        height: px,
        boxShadow: css.shadows.convex,
        border: frame
          ? `4px solid ${css.colors.primary}`
          : `2px solid ${css.border.strong}`,
        ...(frame
          ? {
              padding: css.layout.space.sm,
              backgroundColor: css.colors.surface,
              color: css.colors.primary,
            }
          : { backgroundColor: css.colors.primary, color: css.on.primary }),
        fontWeight: 600,
      }}
    >
      {src ? undefined : fallbackText}
    </MuiAvatar>
  );
}
