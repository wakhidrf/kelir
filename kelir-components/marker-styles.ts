import type * as React from "react";
import type { MarkerProps } from "../kelir-kit/kit-data-display-text";
import { css } from "../kelir-kit/kit-create-css";
 import { statusColors } from "../kelir-kit/kit-variant-values";

export interface MarkerPalette {
  bg: string;
  fg: string;
}

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export const markerPalettes: Record<
  NonNullable<MarkerProps["tone"]>,
  MarkerPalette
> = {
  primary: { bg: css.colors.primary, fg: css.on.primary },
  secondary: { bg: css.colors.secondary, fg: css.on.secondary },
  error: { bg: css.destructive, fg: css.on.destructive },
  success: statusColors.success,
  warning: statusColors.warning,
};

// Marker container styles (internal): status/note/border/separator roles.
export function getMarkerContainer(
  variant: NonNullable<MarkerProps["variant"]>,
  palette: MarkerPalette,
): React.CSSProperties {
  if (variant === "status") {
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: css.layout.space.sm,
      fontSize: "13px",
      fontWeight: 600,
      color: textPrimary,
      padding: `${css.layout.space.xs} 0`,
    };
  }
  if (variant === "note") {
    return {
      display: "flex",
      alignItems: "center",
      gap: css.layout.space.sm,
      fontSize: "13px",
      lineHeight: "1.5",
      padding: "10px 14px",
      borderRadius: css.control.radius,
      backgroundColor: palette.bg,
      color: palette.fg,
    };
  }
  if (variant === "border") {
    return {
      display: "block",
      borderLeft: `4px solid ${palette.bg}`,
      paddingLeft: "10px",
      fontSize: "13px",
      color: textPrimary,
    };
  }
  // separator
  return {
    display: "flex",
    alignItems: "center",
    gap: css.layout.space.md,
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: textSecondary,
  };
}