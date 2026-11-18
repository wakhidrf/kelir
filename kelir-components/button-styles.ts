import type * as React from "react";
import type { ButtonProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function getButtonStyles(
  variant: ButtonProps["variant"],
  size: ButtonProps["size"],
  align: ButtonProps["align"],
): React.CSSProperties {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isDestructive = variant === "destructive";
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  const base: React.CSSProperties = {
    borderRadius: css.radius.button,
    textTransform: "none",
    fontWeight: 600,
    padding:
      size === "xs"
        ? "3px 8px"
        : size === "sm"
          ? "6px 12px"
          : size === "lg"
            ? "14px 28px"
            : "10px 20px",
    ...(size === "xs" ? { fontSize: "11px" } : null),
    transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
    fontFamily: "inherit",
    justifyContent:
      align === "start"
        ? "flex-start"
        : align === "end"
          ? "flex-end"
          : "center",
  };

  if (isPrimary) {
    base.background = css.control.background;
    base.border = "none";
    base.boxShadow = convexShadow;
    base.color = css.on.primary;
  } else if (isSecondary) {
    base.backgroundColor = css.colors.secondary;
    base.border = "none";
    base.boxShadow = convexShadow;
    base.color = css.on.secondary;
  } else if (isDestructive) {
    base.backgroundColor = css.destructive;
    base.border = "none";
    base.boxShadow = convexShadow;
    base.color = css.on.destructive;
  } else if (isOutline) {
    base.backgroundColor = "transparent";
    base.border = `1.5px solid ${css.border.medium}`;
    base.color = textPrimary;
  } else if (isGhost) {
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

export { convexShadow, concaveShadow, neumorphicBg, textPrimary };