import MuiDialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import type { LoadingOverlayProps } from "../kelir-types";
import { css } from "../kelir-variants";

// LoadingOverlay sealed (No 77): overlay pemuatan fullscreen berbasis MUI
// (portal + focus-trap + aria-modal gratis, preseden Dialog). Bukan dialog
// konfirmasi: tanpa judul/tombol/aksi. Hanya props kontrak - tanpa onClose
// (pemuatan tak bisa di-dismiss; Escape/backdrop tak menutup), tanpa
// ...rest ke DOM, tanpa style/sx/className konsumen.
// Kartu tengah berdenyut milik kit (`kelir-loading-pulse` dari CSS provider,
// irama tetap tanpa prop); backdrop redup = default MUI (keputusan kit,
// tanpa rgba hardcode). Nama aksesibel milik kit (aria-label > label >
// progress > "Memuat") dipasang pada paper role=dialog - bukan root
// presentation MUI yang diabaikan AT (preseden Dialog menaruhnya di root,
// di sini dibetulkan).
export function LoadingOverlay({
  open,
  label,
  progress,
  children,
  id,
  "aria-label": ariaLabel,
}: LoadingOverlayProps) {
  const name = ariaLabel ?? label ?? progress ?? "Memuat";
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
