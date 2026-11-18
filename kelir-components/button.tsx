import MuiBox from "@mui/material/Box";
import MuiButton from "@mui/material/Button";
import type * as React from "react";
import type { ButtonProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { getButtonStyles, convexShadow, concaveShadow, neumorphicBg, textPrimary } from "./button-styles";

const textSecondary = css.colors.textSecondary;

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

  const getStyles = (): React.CSSProperties => getButtonStyles(variant, size, align);

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
        ...(size === "md"
          ? null
          : {
              "& .MuiSvgIcon-root": {
                fontSize: size === "xs" ? 14 : size === "sm" ? 18 : 28,
              },
            }),
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