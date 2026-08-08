import MuiDrawer from "@mui/material/Drawer";
import type { DrawerProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

export function Drawer({ title, children, ...props }: DrawerProps) {
  return (
    <MuiDrawer
      {...props}
      slotProps={{
        paper: {
          style: {
            backgroundColor: neumorphicBg,
            boxShadow: convexShadow,
            border: `1px solid ${css.border.light}`,
            backdropFilter: surfaceBlur,
            WebkitBackdropFilter: surfaceBlur,
            fontFamily: "inherit",
          },
        },
      }}
    >
      {title && (
        <div
          style={{
            padding: `${css.layout.space.lg} ${css.layout.space.lg} 0`,
            color: textPrimary,
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          {title}
        </div>
      )}
      {children}
    </MuiDrawer>
  );
}
