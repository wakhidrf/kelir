import MuiToggleButton from "@mui/material/ToggleButton";
import type { ToggleProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function Toggle(props: ToggleProps) {
  return (
    <MuiToggleButton
      {...props}
      sx={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        border: `1px solid ${css.border.light}`,
        boxShadow: convexShadow,
        color: textPrimary,
        fontFamily: "inherit",
        fontSize: "14px",
        textTransform: "none",
        padding: "10px 16px",
        "&:hover": {
          backgroundColor: neumorphicBg,
          boxShadow: concaveShadow,
        },
        "&.Mui-selected": {
          backgroundColor: css.colors.primary,
          color: css.on.primary,
          borderColor: css.colors.primary,
          boxShadow: concaveShadow,
        },
        "&.Mui-selected:hover": {
          backgroundColor: css.colors.primary,
        },
      }}
    />
  );
}
