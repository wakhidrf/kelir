import MuiButton from "@mui/material/Button";
import type * as React from "react";
import type { ButtonProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function Button({ variant = "primary", ...props }: ButtonProps) {
  const isPrimary = variant === "primary";
  const _isSecondary = variant === "secondary";
  const isDestructive = variant === "destructive";
  const isGhost = variant === "ghost";

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      backgroundColor: neumorphicBg,
      borderRadius: css.radius.sm,
      border: `1px solid ${css.border.light}`,
      boxShadow: convexShadow,
      textTransform: "none",
      fontWeight: 600,
      color: textPrimary,
      padding: "10px 20px",
      transition: "all 150ms ease-out",
      fontFamily: "inherit",
      ...props.style,
    };

    if (isPrimary) {
      base.backgroundColor = css.colors.primary;
      base.color = css.on.primary;
    } else if (isDestructive) {
      base.backgroundColor = css.destructive;
      base.color = css.on.destructive;
    } else if (isGhost) {
      base.boxShadow = "none";
      base.border = "none";
    }
    return base;
  };

  return (
    <MuiButton
      {...props}
      style={getStyles()}
      sx={{
        "&:active": {
          boxShadow: concaveShadow,
          transform: "translateY(1px)",
        },
        "&:hover": {
          backgroundColor: isPrimary ? css.colors.primary : undefined,
          opacity: 0.9,
        },
      }}
    />
  );
}
