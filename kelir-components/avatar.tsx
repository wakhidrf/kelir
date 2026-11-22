import MuiAvatar from "@mui/material/Avatar";
import type { AvatarProps } from "../kelir-kit/kit-data-display-content";
import { css } from "../kelir-kit/kit-create-css";

const AVATAR_PX = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  "2xl": 64,
  "3xl": 72,
} as const;

// Pure logic (no DOM): maps size MEANING → kit px.
// Unit-tested directly - jsdom does not compute emotion stylesheets.
export function avatarPx(size: NonNullable<AvatarProps["size"]>): number {
  return AVATAR_PX[size];
}

export function Avatar({
  src,
  alt,
  fallbackText,
  size = "md",
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
