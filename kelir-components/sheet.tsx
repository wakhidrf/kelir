import MuiDrawer from "@mui/material/Drawer";
import type { SheetProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function Sheet({ title, children, ...props }: SheetProps) {
  return (
    <MuiDrawer
      {...props}
      anchor="bottom"
      slotProps={{
        paper: {
          style: {
            backgroundColor: neumorphicBg,
            borderTopLeftRadius: css.radius.md,
            borderTopRightRadius: css.radius.md,
            boxShadow: convexShadow,
            border: `1px solid ${css.border.light}`,
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
