import MuiButtonGroup from "@mui/material/ButtonGroup";
import type { ButtonGroupProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function ButtonGroup({ children, ...props }: ButtonGroupProps) {
  return (
    <MuiButtonGroup
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        color: textPrimary,
        fontFamily: "inherit",
        gap: css.layout.space.sm,
        ...props.style,
      }}
    >
      {children}
    </MuiButtonGroup>
  );
}
