import type * as React from "react";
import type { MarkerProps } from "../kelir-types";
import { css, statusColors } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

const markerColors: Record<
  NonNullable<MarkerProps["color"]>,
  { bg: string; fg: string }
> = {
  primary: { bg: css.colors.primary, fg: css.on.primary },
  secondary: { bg: css.colors.secondary, fg: css.on.secondary },
  error: { bg: css.destructive, fg: css.on.destructive },
  success: statusColors.success,
  warning: statusColors.warning,
};

export function Marker({
  variant = "status",
  color = "primary",
  children,
  style,
}: MarkerProps) {
  const palette = markerColors[color];

  const getContainer = (): React.CSSProperties => {
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
        borderRadius: css.radius.sm,
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
  };

  const container: React.CSSProperties = {
    ...getContainer(),
    fontFamily: "inherit",
    ...style,
  };

  return (
    <div style={container}>
      {variant === "status" && (
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            borderRadius: "999px",
            backgroundColor: palette.bg,
            boxShadow: `0 0 0 3px ${palette.bg}33`,
          }}
        />
      )}
      {variant === "note" && (
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            borderRadius: "999px",
            backgroundColor: palette.fg,
          }}
        />
      )}
      {variant === "separator" && (
        <span
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: css.divider,
          }}
        />
      )}
      <span>{children}</span>
      {variant === "separator" && (
        <span
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: css.divider,
          }}
        />
      )}
    </div>
  );
}
