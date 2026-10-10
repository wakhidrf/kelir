import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import type { AlertProps } from "../kelir-types";
import { css } from "../kelir-variants";

const cardShadow = css.shadows.card;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

// Notifikasi inline sealed (Gel.2 STYLE.md §6): basis MUI; `severity`
// diteruskan (ikon + role alert bawaan MUI), visual milik kit — tanpa
// ...rest, tanpa style/sx/className konsumen. Closable hanya bila onClose ada.
export function Alert({
  title,
  children,
  severity,
  onClose,
  id,
  "aria-label": ariaLabel,
}: AlertProps) {
  return (
    <MuiAlert
      severity={severity}
      onClose={onClose ? () => onClose() : undefined}
      id={id}
      aria-label={ariaLabel}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: cardShadow,
        border: `1px solid ${css.border.light}`,
        backdropFilter: surfaceBlur,
        WebkitBackdropFilter: surfaceBlur,
        color: textPrimary,
        fontFamily: "inherit",
      }}
    >
      {title && (
        <AlertTitle style={{ fontWeight: 700, color: textPrimary }}>
          {title}
        </AlertTitle>
      )}
      {children}
    </MuiAlert>
  );
}
