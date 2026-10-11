import MuiButton from "@mui/material/Button";
import type * as React from "react";
import type { IconButtonProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Tombol ikon-only sealed (P1c STYLE.md §6): icon + aria-label wajib.
// Tanpa ...rest ke DOM, tanpa style/sx/className passthrough.
export function IconButton({
  icon,
  "aria-label": ariaLabel,
  variant = "primary",
  shape = "rounded",
  onClick,
  type = "button",
  disabled,
  "aria-describedby": ariaDescribedby,
  id,
}: IconButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isDestructive = variant === "destructive";
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius:
        shape === "circle"
          ? "50%"
          : shape === "square"
            ? 0
            : css.radius.button,
      textTransform: "none",
      fontWeight: 600,
      padding: "10px",
      minWidth: "40px",
      transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
      fontFamily: "inherit",
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
  };

  return (
    <MuiButton
      variant="text"
      disabled={disabled}
      onClick={onClick}
      type={type}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      style={getStyles()}
      sx={{
        "&:hover": {
          backgroundColor:
            isOutline || isGhost
              ? css.track
              : isPrimary
                ? css.control.background
                : isSecondary
                  ? css.colors.secondary
                  : isDestructive
                    ? css.destructive
                    : neumorphicBg,
          color: isOutline || isGhost ? textPrimary : undefined,
          borderColor: isOutline ? css.border.medium : undefined,
          filter: isOutline || isGhost ? "none" : "brightness(0.92)",
          transform: "translateY(-1px)",
        },
        "&:active": {
          boxShadow: isOutline || isGhost ? "none" : concaveShadow,
          transform: "translateY(1px)",
        },
        "&.Mui-focusVisible": {
          outline: `${css.focusRing.width} solid ${css.focusRing.color}`,
          outlineOffset: css.focusRing.offset,
        },
        "&.Mui-disabled": {
          backgroundColor: css.track,
          color: textSecondary,
          opacity: 1,
        },
      }}
    >
      {icon}
    </MuiButton>
  );
}
