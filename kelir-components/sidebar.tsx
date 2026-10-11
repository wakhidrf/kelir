"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MuiBox from "@mui/material/Box";
import MuiIconButton from "@mui/material/IconButton";
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
      {/* Komposisi internal kit-ke-kit: area tengah isi sisa ruang dan
          scroll di dalam (ScrollArea bounded via maxHeight 100% bila root
          bounded; bila root tak bounded, isi tumbuh mengikuti halaman). */}
      <MuiBox sx={{ flex: 1, minHeight: 0, width: "100%" }}>
        <ScrollArea maxHeight="100%">{children}</ScrollArea>
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
  trigger = "none",
  overlayHeight = "full",
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
  const handleTriggerOpen = () => {
    onOpenChange?.(true);
    if (open === undefined) setUncontrolled(true);
  };
  // Pemicu toggle persistent: saat terbuka naik di atas backdrop Drawer
  // (z 1400 > modal 1300) dengan ikon tutup; saat tertutup ikon buka.
  // Blur dulu: fokus tak boleh tertahan di pemicu (di luar dialog) saat
  // modal meng-aria-hidden-kan page-root — temuan console Chrome mobile.
  const handleTriggerToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    if (overlayOpen) handleClose();
    else handleTriggerOpen();
  };

  if (resolved === "overlay") {
    return (
      <>
        {/* Pemicu tepi toggle milik kit (ISSUE-008): hanya overlay, render
            in-flow di titik penempatan. Tertutup: ikon buka (hamburger /
            chevron kanan). Terbuka: naik di atas backdrop (z 1400) dengan
            ikon tutup (chevron kiri; hamburger tetap). */}
        {trigger !== "none" && (
          <MuiIconButton
            aria-label={
              overlayOpen
                ? ariaLabel
                  ? `Tutup ${ariaLabel}`
                  : "Tutup navigasi"
                : ariaLabel
                  ? `Buka ${ariaLabel}`
                  : "Buka navigasi"
            }
            aria-expanded={overlayOpen}
            aria-controls={id}
            onClick={handleTriggerToggle}
            sx={{
              width: "28px",
              height: "64px",
              padding: 0,
              // position WAJIB: z-index diabaikan pada elemen static —
              // inilah alasan ikon tutup tak muncul di balik backdrop.
              position: "relative",
              borderRadius: 0,
              borderTopRightRadius: css.radius.button,
              borderBottomRightRadius: css.radius.button,
              // Badan opak dari kanvas tema (surface tema kaca itu translusen;
              // tab tepi harus terbaca seperti handle custom lama yang opak).
              backgroundColor: css.colors.baseBackground,
              border: `1px solid ${css.border.light}`,
              borderLeft: "none",
              boxShadow: css.shadows.convex,
              color: css.colors.textPrimary,
              zIndex: overlayOpen ? 1400 : "auto",
            }}
          >
            {overlayOpen ? (
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            ) : trigger === "hamburger" ? (
              <MenuIcon sx={{ fontSize: 18 }} />
            ) : (
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            )}
          </MuiIconButton>
        )}
        <Drawer open={overlayOpen} onClose={handleClose} id={id} aria-label={ariaLabel}>
          <MuiBox
            sx={{
              display: "flex",
              flexDirection: "column",
              width: OVERLAY_WIDTH,
              // full = drawer penuh; content = bungkus isi (paper Drawer
              // tetap jadi latar).
              height: overlayHeight === "full" ? "100%" : "auto",
              maxHeight: "100dvh",
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
      </>
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
        // Ikuti parent bila bounded (mis. kotak 680px showcase → scroll
        // internal); bila tak bounded, tumbuh mengikuti halaman; dibatasi
        // viewport agar tak pernah lebih tinggi dari layar.
        height: "100%",
        maxHeight: "100dvh",
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
