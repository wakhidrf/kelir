import type * as React from "react";
import type { IconButtonProps } from "../kelir-types";
import { css } from "../kelir-variants";

type Variant = NonNullable<IconButtonProps["variant"]>;
type Shape = NonNullable<IconButtonProps["shape"]>;
type Size = NonNullable<IconButtonProps["size"]>;

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

// IconButton frame styles (internal): shape, size, and variant role. The
// hover/active/focus states stay with the component (sx).
export function getIconButtonStyles({
  variant,
  shape,
  size,
}: {
  variant: Variant;
  shape: Shape;
  size: Size;
}): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius:
      shape === "circle" ? "50%" : shape === "square" ? 0 : css.radius.button,
    textTransform: "none",
    fontWeight: 600,
    // Kit sizing: md = today's behavior (zero visual change); xs tighter, lg..3xl
    // share the lg frame.
    padding:
      size === "xs" ? "4px" : size === "sm" ? "6px" : size === "md" ? "10px" : "14px",
    minWidth:
      size === "xs" ? "28px" : size === "sm" ? "32px" : size === "md" ? "40px" : "48px",
    transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
    fontFamily: "inherit",
  };

  if (variant === "primary") {
    base.background = css.control.background;
    base.border = "none";
    base.boxShadow = convexShadow;
    base.color = css.on.primary;
  } else if (variant === "secondary") {
    base.backgroundColor = css.colors.secondary;
    base.border = "none";
    base.boxShadow = convexShadow;
    base.color = css.on.secondary;
  } else if (variant === "destructive") {
    base.backgroundColor = css.destructive;
    base.border = "none";
    base.boxShadow = convexShadow;
    base.color = css.on.destructive;
  } else if (variant === "outline") {
    base.backgroundColor = "transparent";
    base.border = `1.5px solid ${css.border.medium}`;
    base.color = textPrimary;
  } else if (variant === "ghost") {
    base.backgroundColor = "transparent";
    base.border = "none";
    base.boxShadow = "none";
    base.color = textPrimary;
  } else {
    base.backgroundColor = neumorphicBg;
    base.border = `1px solid ${css.border.light}`;
    base.boxShadow = convexShadow;
    base.color = textPrimary;
  }
  return base;
}