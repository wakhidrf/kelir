"use client";

import MuiBox from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import type { SidebarProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Drawer } from "./drawer";
import { ScrollArea } from "./scroll-area";

// Lebar milik kit (ISSUE-005); overlay dibatasi 85vw agar tak makan layar.
const SIDEBAR_WIDTH = "var(--sidebar-width, 260px)";
const OVERLAY_WIDTH = `min(${SIDEBAR_WIDTH}, 85vw)`;
// Ambang internal kit (md MUI); bukan angka konsumen.
const DESKTOP_QUERY = "(min-width: 900px)";

function SidebarBody({
  header,
  footer,
  children,
}: Pick<SidebarProps, "header" | "footer" | "children">) {
  return (
    <>
      {header && <MuiBox sx={{ flexShrink: 0 }}>{header}</MuiBox>}
      {/* Komposisi internal kit-ke-kit: area tengah isi sisa ruang. */}
      <MuiBox sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
        <ScrollArea>{children}</ScrollArea>
      </MuiBox>
      {footer && <MuiBox sx={{ flexShrink: 0 }}>{footer}</MuiBox>}
    </>
  );
}

export function Sidebar({
  header,
  footer,
  children,
  mode = "auto",
  open,
  defaultOpen = false,
  onOpenChange,
  id,
  "aria-label": ariaLabel,
}: SidebarProps) {
  // noSsr + defaultMatches: render server & pertama sama (docked),
  // koreksi setelah mount — tanpa hydration mismatch.
  const isDesktop = useMediaQuery(DESKTOP_QUERY, {
    defaultMatches: true,
    noSsr: true,
  });
  const resolved = mode === "auto" ? (isDesktop ? "docked" : "overlay") : mode;

  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const overlayOpen = open ?? uncontrolled;
  const handleClose = () => {
    onOpenChange?.(false);
    if (open === undefined) setUncontrolled(false);
  };

  if (resolved === "overlay") {
    return (
      <Drawer open={overlayOpen} onClose={handleClose} id={id} aria-label={ariaLabel}>
        <MuiBox
          sx={{
            display: "flex",
            flexDirection: "column",
            width: OVERLAY_WIDTH,
            height: "100%",
            color: css.colors.textPrimary,
            fontFamily: "inherit",
            overflow: "hidden",
          }}
        >
          <SidebarBody header={header} footer={footer}>
            {children}
          </SidebarBody>
        </MuiBox>
      </Drawer>
    );
  }

  return (
    <MuiBox
      component="nav"
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100dvh",
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.card,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        color: css.colors.textPrimary,
        fontFamily: "inherit",
        overflow: "hidden",
      }}
    >
      <SidebarBody header={header} footer={footer}>
        {children}
      </SidebarBody>
    </MuiBox>
  );
}
