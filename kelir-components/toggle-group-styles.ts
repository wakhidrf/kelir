import { css } from "../kelir-variants";

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

export function buttonSx(joined: boolean, size: "sm" | "md" | "lg") {
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
          padding:
            size === "sm" ? "6px 12px" : size === "lg" ? "12px 18px" : "9px 14px",
        }
      : {
          border: `1px solid ${css.border.light}`,
          boxShadow: css.shadows.convex,
          padding:
            size === "sm"
              ? `${css.layout.space.xs} 12px`
              : size === "lg"
                ? `${css.layout.space.md} 18px`
                : `${css.layout.space.sm} 14px`,
        }),
    "&:hover": joined
      ? { backgroundColor: css.divider }
      : {
          backgroundColor: css.colors.surface,
          boxShadow: css.shadows.concave,
        },
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