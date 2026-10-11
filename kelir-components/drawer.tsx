import MuiDrawer from "@mui/material/Drawer";
import MuiBox from "@mui/material/Box";
import type { DrawerProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Drawer({
  open,
  onClose,
  title,
  children,
  paperHeight = "full",
  id,
  "aria-label": ariaLabel,
}: DrawerProps) {
  return (
    <MuiDrawer
      open={open}
      // Adaptor zero-arg: MUI memanggil (event, reason); kontrak kit tanpa argumen.
      onClose={() => onClose()}
      id={id}
      aria-label={ariaLabel}
      slotProps={{
        paper: {
          style: {
            backgroundColor: css.colors.surface,
            boxShadow: css.shadows.convex,
            border: `1px solid ${css.border.light}`,
            backdropFilter: css.motion.blur.backdrop,
            WebkitBackdropFilter: css.motion.blur.backdrop,
            fontFamily: "inherit",
            // auto = paper bungkus isi + tengah vertikal. Syarat: height
            // harus DEFINITE (fit-content) — height:auto + top/bottom:0
            // justru meregang penuh karena margin auto jadi nol! Tanpa
            // transform agar tak bentrok transisi Slide (margin yang
            // memusatkan, bukan translate). overflowY visible: paper mode
            // content TAK PERNAH scroll sendiri (pecahan subpixel 151.5 vs
            // 150 memicu slider hantu); scroll milik ScrollArea dalam bila
            // konten melebihi cap.
            ...(paperHeight === "auto"
              ? {
                  height: "fit-content",
                  maxHeight: "90dvh",
                  top: 0,
                  bottom: 0,
                  marginTop: "auto",
                  marginBottom: "auto",
                  overflowY: "visible",
                }
              : {}),
          },
          // Nama dialog (role=dialog ada di paper, bukan root) — temuan axe
          // via Sidebar overlay (ISSUE-008). Root tetap berlabel seperti semula.
          ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
        },
      }}
    >
      {title && (
        <MuiBox
          sx={{
            padding: `${css.layout.space.lg} ${css.layout.space.lg} 0`,
            color: css.colors.textPrimary,
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          {title}
        </MuiBox>
      )}
      {children}
    </MuiDrawer>
  );
}
