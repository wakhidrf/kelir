import MuiButton from "@mui/material/Button";
import type { IconButtonProps } from "../kelir-kit/kit-actions";
import { css } from "../kelir-kit/kit-create-css";
import { getIconButtonStyles } from "./icon-button-styles";

const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Icon-only sealed button (P1c STYLE.md §6): icon + aria-label required.
// No ...rest to DOM, no style/sx/className passthrough.
export function IconButton({
  icon,
  "aria-label": ariaLabel,
  variant = "primary",
  shape = "rounded",
  size = "md",
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

  return (
    <MuiButton
      variant="text"
      disabled={disabled}
      onClick={onClick}
      type={type}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      style={getIconButtonStyles({ variant, shape, size })}
      sx={{
        // Icon ~16px (xs) / ~18px (sm) / ~28px (lg..3xl); md without rule = MUI default.
        ...(size === "md"
          ? null
          : {
              "& .MuiSvgIcon-root": {
                fontSize: size === "xs" ? 16 : size === "sm" ? 18 : 28,
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
      {icon}
    </MuiButton>
  );
}
