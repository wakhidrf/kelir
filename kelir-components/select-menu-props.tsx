"use client";

import type { KitSize } from "../kelir-types";
import { css } from "../kelir-variants";
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

export function getSelectSx(size: KitSize) {
  const small = size === "xs" || size === "sm";
  return {
    minWidth: small ? "224px" : "240px",
    "& .MuiSelect-select": {
      padding: small ? "7px 32px 7px 12px" : "10px 36px 10px 14px",
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