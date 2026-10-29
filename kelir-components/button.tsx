import MuiBox from "@mui/material/Box";
import MuiButton from "@mui/material/Button";
import type * as React from "react";
import type { ButtonProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Sealed (P1c STYLE.md §6): props eksplisit, tanpa ...rest ke DOM, tanpa
// style/sx/className passthrough. Visual di bawah milik Kelir sepenuhnya.
export function Button({
  children,
  startIcon,
  endIcon,
  endContent,
  variant = "primary",
  align = "center",
  size = "md",
  onClick,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  id,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isDestructive = variant === "destructive";
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: css.radius.button,
      textTransform: "none",
      fontWeight: 600,
      // Ukuran milik kit: md = perilaku hari ini (nol-ubah visual).
      padding: size === "sm" ? "6px 12px" : size === "lg" ? "14px 28px" : "10px 20px",
      transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
      fontFamily: "inherit",
      // Perataan eksplisit (inline → teruji): default center = perilaku MUI.
      // Nilai logis start/end: flex-start/end mengikuti arah tulisan (RTL).
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
      startIcon={startIcon}
      endIcon={endIcon}
      style={getStyles()}
      sx={{
        // Ikon ~18px (sm, preseden tab chevron sidebar) / ~28px (lg);
        // md tanpa aturan = bawaan MUI hari ini.
        ...(size === "md"
          ? null
          : { "& .MuiSvgIcon-root": { fontSize: size === "sm" ? 18 : 28 } }),
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
      {children}
      {endContent ? (
        <MuiBox
          component="span"
          sx={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            fontSize: "inherit",
          }}
        >
          {endContent}
        </MuiBox>
      ) : null}
    </MuiButton>
  );
}
