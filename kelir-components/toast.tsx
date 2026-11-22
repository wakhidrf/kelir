"use client";

import MuiSnackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import * as React from "react";
import type { ToastProps } from "../kelir-kit/kit-feedback";
import { css } from "../kelir-kit/kit-create-css";
 import { statusColors } from "../kelir-kit/kit-variant-values";

// INTERNAL kit: Toaster stacks Toasts inside its own container.
// This context makes the MUI Snackbar root static so each Toast follows the
// container flex flow, without adding visual props to the Toast contract.
export const ToastStackContext = React.createContext(false);

const stackedSnackbarStyle: React.CSSProperties = {
  position: "static",
  inset: "auto",
  width: "auto",
  maxWidth: "100%",
  margin: 0,
  transform: "none",
};

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

// Kit-owned MEANING accent (`tone?`): a thick left-side strip — precedent
// Card.flag (solid strip, not raw color). Without `tone` = neutral today
// (zero visual change). Color pairs from kit/status tokens.
const toneAccents = {
  info: css.colors.primary,
  success: statusColors.success.fg,
  warning: statusColors.warning.fg,
  error: css.destructive,
} as const;

// Sealed transient notification (Gel.2 STYLE.md §6): MUI base; `onClose`
// semantics (MUI reason dropped); content + action owned by the kit. No ...rest,
// no consumer style/sx/className/anchorOrigin.
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
  const stacked = React.useContext(ToastStackContext);

  return (
    <MuiSnackbar
      open={open}
      onClose={(_e, _reason) => onClose()}
      autoHideDuration={autoHideDuration}
      id={id}
      aria-label={ariaLabel}
      style={stacked ? stackedSnackbarStyle : undefined}
    >
      <SnackbarContent
        message={
          // Kit-owned a11y (P2 PLAN.md): message = polite live region so
          // screen readers announce the notification without stealing focus.
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
