import type * as React from "react";
import type { ButtonProps } from "../kelir-kit/kit-actions";
import { css } from "../kelir-kit/kit-create-css";
import { getControlMetrics } from "./input";

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

  // Button shares the control metrics (line-height, block padding, font size)
  // with Input/Select/NativeSelect, so a Button of one size is exactly as tall
  // as a field of the same size (#145). xl..3xl degrade to lg; xs keeps its
  // tight in-table frame.
  const isXs = size === "xs";
  const isLg =
    size === "lg" || size === "xl" || size === "2xl" || size === "3xl";
  const step = isXs ? "xs" : isLg ? "lg" : (size ?? "md");
  const metrics = getControlMetrics(step === "lg" ? "md" : step);
  const blockPadding = isXs
    ? "0.1875rem"
    : isLg
      ? css.layout.space.md
      : metrics.paddingBlock;
  const inlinePadding = isXs ? "0.5rem" : isLg ? "1.5rem" : metrics.paddingInline;

  const base: React.CSSProperties = {
    borderRadius: css.radius.button,
    textTransform: "none",
    fontWeight: 600,
    padding: `${blockPadding} ${inlinePadding}`,
    lineHeight: 1.4375,
    fontSize: isXs ? "0.6875rem" : metrics.fontSize,
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
    base.border = "1px solid transparent";
    base.boxShadow = convexShadow;
    base.color = css.on.primary;
  } else if (isSecondary) {
    base.backgroundColor = css.colors.secondary;
    base.border = "1px solid transparent";
    base.boxShadow = convexShadow;
    base.color = css.on.secondary;
  } else if (isDestructive) {
    base.backgroundColor = css.destructive;
    base.border = "1px solid transparent";
    base.boxShadow = convexShadow;
    base.color = css.on.destructive;
  } else if (isOutline) {
    base.backgroundColor = "transparent";
    base.border = `1px solid ${css.border.medium}`;
    base.color = textPrimary;
  } else if (isGhost) {
    base.backgroundColor = "transparent";
    base.border = "1px solid transparent";
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