import MuiDialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import type { LoadingOverlayProps } from "../kelir-kit/kit-misc-overlay";
import { css } from "../kelir-kit/kit-create-css";

// LoadingOverlay sealed (No 77): MUI-based fullscreen loading overlay
// (portal + focus-trap + aria-modal for free, Dialog precedent). Not a
// confirmation dialog: no title/buttons/actions. Only contract props - no
// onClose (loading cannot be dismissed; Escape/backdrop do not close), no
// ...rest to DOM, no consumer style/sx/className.
// The kit's pulsing center card (`kelir-loading-pulse` from the CSS provider,
// fixed rhythm without props); dim backdrop = MUI default (kit decision,
// no hardcoded rgba). The accessible name belongs to the kit (aria-label >
// label > progress > "Loading"), set on the role=dialog paper - not the MUI
// presentation root ignored by AT (Dialog precedent puts it on the root,
// corrected here).
export function LoadingOverlay({
  open,
  label,
  progress,
  children,
  id,
  "aria-label": ariaLabel,
}: LoadingOverlayProps) {
  const name = ariaLabel ?? label ?? progress ?? "Loading";
  return (
    <MuiDialog
      open={open}
      maxWidth="xs"
      disableScrollLock
      id={id}
      slotProps={{
        paper: {
          "aria-label": name,
          style: {
            backgroundColor: css.colors.surface,
            borderRadius: css.radius.prominent,
            boxShadow: css.shadows.convex,
            border: `1px solid ${css.border.light}`,
            fontFamily: "inherit",
            padding: `${css.layout.space.xl} ${css.layout.space["2xl"]}`,
            textAlign: "center",
            animation: "kelir-loading-pulse 1.6s ease-in-out infinite",
          },
        },
      }}
    >
      <DialogContent
        style={{
          color: css.colors.textSecondary,
          fontSize: "14px",
          overflowX: "hidden",
          padding: 0,
        }}
      >
        {children}
        {label && (
          <div style={{ color: css.colors.textPrimary, fontWeight: 700 }}>
            {label}
          </div>
        )}
        {progress && <div>{progress}</div>}
      </DialogContent>
    </MuiDialog>
  );
}
