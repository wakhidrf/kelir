import type { KitSize } from "../kelir-kit/kit-size";
import { css } from "../kelir-kit/kit-create-css";

export function groupSx(joined: boolean) {
  return {
    display: "inline-flex",
    backgroundColor: css.colors.surface,
    borderRadius: css.radius.button,
    ...(joined
      ? { boxShadow: css.shadows.card, overflow: "hidden" }
      : {
          gap: css.layout.space.sm,
          border: `1px solid ${css.border.light}`,
          boxShadow: css.shadows.convex,
          padding: "6px",
        }),
  };
}

export function buttonSx(joined: boolean, size: KitSize) {
  const small = size === "xs" || size === "sm";
  const large = size === "lg" || size === "xl" || size === "2xl" || size === "3xl";
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "inherit",
    fontSize: "14px",
    textTransform: "none",
    borderRadius: joined ? 0 : css.radius.button,
    color: joined ? css.colors.textSecondary : css.colors.textPrimary,
    backgroundColor: joined ? "transparent" : css.colors.surface,
    ...(joined
      ? {
          fontWeight: 600,
          padding: small ? "6px 12px" : large ? "12px 18px" : "9px 14px",
        }
      : {
          border: `1px solid ${css.border.light}`,
          boxShadow: css.shadows.convex,
          padding: small
            ? `${css.layout.space.xs} 12px`
            : large
              ? `${css.layout.space.md} 18px`
              : `${css.layout.space.sm} 14px`,
        }),
    "&:hover": joined
      ? { backgroundColor: css.divider }
      : {
          backgroundColor: css.colors.surface,
          boxShadow: css.shadows.concave,
        },
    /* Primary targets answer in the motion verb: the inner label lifts, so the
       hover is a movement and not a color swap alone (quality-bar). */
    "& > span": {
      display: "inline-block",
      transition: `transform ${css.motion.duration.hover} ${css.motion.easing.curve}`,
    },
    "&:hover > span": { transform: "translateY(-1px)" },
    /* The global focus ring is the primary color, which disappears on the
       primary-filled selected item: the selected item gets an onPrimary ring. */
    "&:focus-visible": {
      outline: `2px solid ${css.colors.primary}`,
      outlineOffset: "-2px",
    },
    "&.Mui-selected:focus-visible": { outlineColor: css.on.primary },
    "&.Mui-selected": {
      backgroundColor: css.colors.primary,
      color: css.on.primary,
      ...(joined
        ? null
        : {
            borderColor: css.colors.primary,
            boxShadow: css.shadows.concave,
          }),
    },
    "&.Mui-selected:hover": {
      backgroundColor: css.colors.primary,
    },
    "&.MuiToggleButtonGroup-grouped": {
      borderRadius: joined ? 0 : css.radius.button,
      marginLeft: 0,
      marginRight: 0,
    },
  };
}