import MuiDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { DialogProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Dialog({ title, actions, children, ...props }: DialogProps) {
  return (
    <MuiDialog
      {...props}
      slotProps={{
        paper: {
          style: {
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.md,
            boxShadow: convexShadow,
            border: `1px solid ${css.border.light}`,
            fontFamily: "inherit",
          },
        },
      }}
    >
      {title && (
        <DialogTitle style={{ color: textPrimary, fontWeight: 700 }}>
          {title}
        </DialogTitle>
      )}
      <DialogContent style={{ color: textSecondary, fontSize: "14px" }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions
          style={{ padding: `${css.layout.space.lg} ${css.layout.space.xl}` }}
        >
          {actions}
        </DialogActions>
      )}
    </MuiDialog>
  );
}
