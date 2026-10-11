import MuiDrawer from "@mui/material/Drawer";
import MuiBox from "@mui/material/Box";
import type { SheetProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Sheet({
  open,
  onClose,
  title,
  children,
  id,
  "aria-label": ariaLabel,
}: SheetProps) {
  return (
    <MuiDrawer
      open={open}
      // Adaptor zero-arg: MUI memanggil (event, reason); kontrak kit tanpa argumen.
      onClose={() => onClose()}
      anchor="bottom"
      id={id}
      aria-label={ariaLabel}
      slotProps={{
        paper: {
          style: {
            backgroundColor: css.colors.surface,
            borderTopLeftRadius: css.radius.prominent,
            borderTopRightRadius: css.radius.prominent,
            boxShadow: css.shadows.convex,
            border: `1px solid ${css.border.light}`,
            backdropFilter: css.motion.blur.backdrop,
            WebkitBackdropFilter: css.motion.blur.backdrop,
            fontFamily: "inherit",
          },
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
