import MuiDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { DialogProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Dialog sealed (P1c STYLE.md §6): basis MUI untuk multi-platform; hanya
// props kontrak — tanpa ...rest ke DOM, tanpa style/sx/className konsumen.
// `onClose` semantik (tanpa event/reason MUI). `disableScrollLock` keputusan
// kit. `aria-labelledby` dipasang otomatis dari title (a11y milik kit).
export function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  id,
  "aria-label": ariaLabel,
}: DialogProps) {
  const titleId = title ? `${id ?? "kelir-dialog"}-title` : undefined;
  return (
    <MuiDialog
      open={open}
      onClose={() => onClose()}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      disableScrollLock
      slotProps={{
        paper: {
          style: {
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.md,
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
        <DialogTitle id={titleId} style={{ color: textPrimary, fontWeight: 700 }}>
          {title}
        </DialogTitle>
      )}
      <DialogContent
        style={{
          color: textSecondary,
          fontSize: "14px",
          overflowX: "hidden",
        }}
      >
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
