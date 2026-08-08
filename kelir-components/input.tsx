import MuiInputBase from "@mui/material/InputBase";
import type { InputProps } from "../kelir-types";
import { css } from "../kelir-variants";

const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

export function Input({ ...props }: InputProps) {
  return (
    <MuiInputBase
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: concaveShadow,
        border: `1px solid ${css.border.light}`,
        backdropFilter: surfaceBlur,
        WebkitBackdropFilter: surfaceBlur,
        padding: `${css.layout.space.sm} ${css.layout.space.lg}`,
        color: textPrimary,
        fontFamily: "inherit",
        fontSize: "14px",
        transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
        ...props.style,
      }}
      sx={{
        "&.Mui-focused": {
          borderColor: css.colors.primary,
        },
        "&:focus-visible": {
          outline: `${css.focusRing.width} solid ${css.focusRing.color}`,
          outlineOffset: css.focusRing.offset,
        },
      }}
    />
  );
}
