import MuiBox from "@mui/material/Box";
import type { SidebarProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { ScrollArea } from "./scroll-area";

export function Sidebar({
  header,
  footer,
  children,
  id,
  "aria-label": ariaLabel,
}: SidebarProps) {
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: "220px",
        maxWidth: "280px",
        height: "100%",
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.sm,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        color: css.colors.textPrimary,
        fontFamily: "inherit",
        overflow: "hidden",
      }}
    >
      {header && (
        <MuiBox sx={{ flexShrink: 0 }}>{header}</MuiBox>
      )}
      {/* Komposisi internal kit-ke-kit: pembungkus flex milik Sidebar,
          ScrollArea sealed tanpa style. */}
      <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
        <ScrollArea>{children}</ScrollArea>
      </div>
      {footer && (
        <MuiBox sx={{ flexShrink: 0 }}>{footer}</MuiBox>
      )}
    </MuiBox>
  );
}
