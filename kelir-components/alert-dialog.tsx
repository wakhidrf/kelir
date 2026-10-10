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

// Konfirmasi sealed (Gel.2 STYLE.md §6): basis MUI; tombol via Button sealed
// (ghost/cancel + destructive/confirm); Escape/backdrop = onCancel.
// Tanpa ...rest, tanpa style/sx/className, tanpa disableScrollLock konsumen.
export function AlertDialog({
  open,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel,
  onConfirm,
  id,
  "aria-label": ariaLabel,
}: AlertDialogProps) {
  const titleId = `${id ?? "kelir-alert-dialog"}-title`;
  const descId = `${id ?? "kelir-alert-dialog"}-description`;
  return (
    <MuiDialog
      open={open}
      onClose={() => onCancel?.()}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      aria-describedby={descId}
      disableScrollLock
      slotProps={{
        paper: {
          style: {
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.md,
            boxShadow: convexShadow,
            border: `1px solid ${css.border.light}`,
            backdropFilter: css.motion.blur.backdrop,
            WebkitBackdropFilter: css.motion.blur.backdrop,
            fontFamily: "inherit",
            padding: css.layout.space.sm,
          },
        },
      }}
    >
      <DialogTitle
        id={titleId}
        style={{ color: textPrimary, fontWeight: 700 }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <div
          id={descId}
          style={{ color: textSecondary, fontSize: "14px", lineHeight: "1.6" }}
        >
          {description}
        </div>
      </DialogContent>
      <DialogActions
        style={{ padding: `${css.layout.space.lg} ${css.layout.space.xl}` }}
      >
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
