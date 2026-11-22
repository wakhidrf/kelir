import MuiDrawer from "@mui/material/Drawer";
import MuiBox from "@mui/material/Box";
import type { DrawerProps } from "../kelir-kit/kit-misc-overlay";
import { css } from "../kelir-kit/kit-create-css";

export function Drawer({
  open,
  onClose,
  title,
  children,
  height = "full",
  id,
  "aria-label": ariaLabel,
}: DrawerProps) {
  return (
    <MuiDrawer
      open={open}
      // Zero-arg adapter: MUI calls (event, reason); kit contract takes no arguments.
      onClose={() => onClose()}
      id={id}
      aria-label={ariaLabel}
      slotProps={{
        paper: {
          style: {
            backgroundColor: css.colors.surface,
            boxShadow: css.shadows.convex,
            border: `1px solid ${css.border.light}`,
            // Card-like curve on the RIGHT side ONLY (kit Drawer always
            // sticks to the left; ISSUE-008).
            borderTopRightRadius: css.radius.card,
            borderBottomRightRadius: css.radius.card,
            backdropFilter: css.motion.blur.backdrop,
            WebkitBackdropFilter: css.motion.blur.backdrop,
            fontFamily: "inherit",
            // auto = paper wraps content + vertically centered. Requirement: height
            // must be DEFINITE (fit-content) - height:auto + top/bottom:0
            // actually stretches full because auto margin becomes zero! No
            // transform so it doesn't clash with the Slide transition (margin
            // centers it, not translate). overflowY visible: content-mode paper
            // NEVER scrolls on its own (subpixel fractions 151.5 vs 150
            // trigger a ghost slider); scrolling belongs to the inner ScrollArea when
            // content exceeds the cap.
            ...(height === "auto"
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
          // Dialog name (role=dialog is on the paper, not the root) - axe finding
          // via the Sidebar overlay (ISSUE-008). Root stays labeled as before.
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
