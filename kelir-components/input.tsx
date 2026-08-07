import MuiInputBase from "@mui/material/InputBase";
import type { InputProps } from "../kelir-types";
import { css } from "../kelir-variants";

const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
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
        padding: `${css.layout.space.sm} ${css.layout.space.lg}`,
        color: textPrimary,
        fontFamily: "inherit",
        fontSize: "14px",
        transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
        ...props.style,
      }}
    />
  );
}
