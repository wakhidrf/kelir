import MuiAvatar from "@mui/material/Avatar";
import type { AvatarProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;

export function Avatar({ fallbackText, ...props }: AvatarProps) {
  return (
    <MuiAvatar
      {...props}
      style={{
        boxShadow: convexShadow,
        border: `2px solid ${css.border.strong}`,
        backgroundColor: css.colors.primary,
        color: css.on.primary,
        fontWeight: 600,
        ...props.style,
      }}
    >
      {fallbackText || props.children}
    </MuiAvatar>
  );
}
