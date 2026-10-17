import MuiSnackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import type { ToastProps } from "../kelir-types";
import { css, statusColors } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

// Aksen MAKNA milik kit (`tone?`): strip sisi kiri tebal — preseden
// Card.flag (strip solid, bukan warna mentah). Tanpa `tone` = netral hari ini
// (nol-ubah visual). Pasangan warna dari token kit/status.
const toneAccents = {
  info: css.colors.primary,
  success: statusColors.success.fg,
  warning: statusColors.warning.fg,
  error: css.destructive,
} as const;

// Notifikasi sementara sealed (Gel.2 STYLE.md §6): basis MUI; `onClose`
// semantik (alasan MUI dibuang); konten + aksi milik kit. Tanpa ...rest,
// tanpa style/sx/className/anchorOrigin konsumen.
export function Toast({
  message,
  tone,
  actionButton,
  open,
  onClose,
  autoHideDuration = 6000,
  id,
  "aria-label": ariaLabel,
}: ToastProps) {
  return (
    <MuiSnackbar
      open={open}
      onClose={(_e, _reason) => onClose()}
      autoHideDuration={autoHideDuration}
      id={id}
      aria-label={ariaLabel}
    >
      <SnackbarContent
        message={
          // A11y milik kit (P2 PLAN.md): pesan = live region sopan agar
          // screen reader mengumumkan notifikasi tanpa mencuri fokus.
          <span
            role="status"
            aria-live="polite"
            style={{ color: textPrimary, fontSize: "14px" }}
          >
            {message}
          </span>
        }
        action={actionButton}
        style={{
          backgroundColor: neumorphicBg,
          borderRadius: css.radius.surface,
          boxShadow: convexShadow,
          border: `1px solid ${css.border.light}`,
          backdropFilter: surfaceBlur,
          WebkitBackdropFilter: surfaceBlur,
          fontFamily: "inherit",
          ...(tone
            ? { borderLeft: `4px solid ${toneAccents[tone]}` }
            : null),
        }}
      />
    </MuiSnackbar>
  );
}
