import MuiDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { AlertDialogProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Button } from "./button";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function AlertDialog({
  open,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel,
  onConfirm,
  ...props
}: AlertDialogProps) {
  return (
    <MuiDialog
      {...props}
      open={open}
      onClose={props.onClose ?? onCancel}
      slotProps={{
        paper: {
          style: {
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.md,
            boxShadow: convexShadow,
            border: `1px solid ${css.border.light}`,
            fontFamily: "inherit",
            padding: "8px",
          },
        },
      }}
    >
      <DialogTitle style={{ color: textPrimary, fontWeight: 700 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <div
          style={{ color: textSecondary, fontSize: "14px", lineHeight: "1.6" }}
        >
          {description}
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "16px 24px" }}>
        <Button variant="ghost" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
}
