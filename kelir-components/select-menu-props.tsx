"use client";

import type { KitSize } from "../kelir-kit/kit-size";
import { css } from "../kelir-kit/kit-create-css";
import { getControlMetrics } from "./input";
import { menuScrollbarSx, scrollbarClass } from "./select-menu-styles";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;

export function getMenuSlotProps(menuWidth: number | undefined) {
  return {
    disableScrollLock: true,
    slotProps: {
      paper: {
        className: scrollbarClass,
        sx: menuScrollbarSx,
        style: {
          backgroundColor: neumorphicBg,
          borderRadius: css.radius.surface,
          boxShadow: convexShadow,
          border: `1px solid ${css.border.light}`,
          backdropFilter: surfaceBlur,
          WebkitBackdropFilter: surfaceBlur,
          marginTop: css.layout.space.sm,
          width: menuWidth ? `${menuWidth}px` : undefined,
          maxHeight: "min(60vh, 360px)",
          overflowY: "auto" as const,
        },
      },
      list: {
        className: scrollbarClass,
        sx: menuScrollbarSx,
        style: { width: "100%" },
      },
    },
  };
}

// Right gutter reserved for the dropdown icon. Block/inline padding come from
// the shared control metrics so Select matches Input of the same size (#139).
const iconGutter = (small: boolean) => (small ? "32px" : "36px");

export function getSelectSx(size: KitSize) {
  const { small, paddingBlock, paddingInline } = getControlMetrics(size);
  return {
    "& .MuiSelect-select": {
      padding: `${paddingBlock} ${iconGutter(small)} ${paddingBlock} ${paddingInline}`,
    },
    "& .MuiSelect-icon": {
      color: css.colors.textSecondary,
      right: css.layout.space.sm,
    },
    "&.Mui-focused": {
      borderColor: css.colors.primary,
      "& .MuiInputBase-root": {
        borderColor: css.colors.primary,
      },
    },
    "&:focus-visible": {
      outline: `${css.focusRing.width} solid ${css.focusRing.color}`,
      outlineOffset: css.focusRing.offset,
    },
  };
}

export function getMenuItemStyle() {
  return {
    color: css.colors.textPrimary,
    fontFamily: "inherit",
    fontSize: "14px",
    whiteSpace: "normal",
    wordBreak: "break-word" as const,
    overflowWrap: "anywhere" as const,
    lineHeight: 1.4,
  };
}

export function getMenuItemSx() {
  return {
    whiteSpace: "normal",
    "&.Mui-selected": {
      backgroundColor: css.colors.primary,
      color: css.on.primary,
    },
    "&.Mui-selected:hover": {
      backgroundColor: css.colors.primary,
      color: css.on.primary,
    },
    "&:hover": {
      backgroundColor: css.colors.primary,
      color: css.on.primary,
      opacity: 0.9,
    },
  };
}