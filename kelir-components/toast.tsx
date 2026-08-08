import MuiSnackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import type { ToastProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

export function Toast({ message, actionButton, ...props }: ToastProps) {
  return (
    <MuiSnackbar {...props}>
      <SnackbarContent
        message={
          <span style={{ color: textPrimary, fontSize: "14px" }}>
            {message}
          </span>
        }
        action={actionButton}
        style={{
          backgroundColor: neumorphicBg,
          borderRadius: css.radius.sm,
          boxShadow: convexShadow,
          border: `1px solid ${css.border.light}`,
          backdropFilter: surfaceBlur,
          WebkitBackdropFilter: surfaceBlur,
          fontFamily: "inherit",
        }}
      />
    </MuiSnackbar>
  );
}
