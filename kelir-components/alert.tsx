import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import type { AlertProps } from "../kelir-kit/kit-feedback";
import { css } from "../kelir-kit/kit-create-css";

const cardShadow = css.shadows.card;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

// Inline notification sealed (Gel.2 STYLE.md §6): MUI-based; `tone`
// forwarded (icon + MUI's built-in alert role), visuals owned by the kit —
// no ...rest, no consumer style/sx/className. Closable only when onClose exists.
export function Alert({
  title,
  children,
  tone,
  onClose,
  id,
  "aria-label": ariaLabel,
}: AlertProps) {
  return (
    <MuiAlert
      severity={tone}
      onClose={onClose ? () => onClose() : undefined}
      id={id}
      aria-label={ariaLabel}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.card,
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
