"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MuiBox from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { SidebarProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Drawer } from "./drawer";
import { IconButton } from "./icon-button";
import { ScrollArea } from "./scroll-area";

// Lebar milik kit (ISSUE-005): overlay maksimal separuh halaman.
const SIDEBAR_WIDTH = "var(--sidebar-width, 260px)";
const OVERLAY_WIDTH = `min(${SIDEBAR_WIDTH}, 50vw)`;
// Napas tab pemicu dari tepi drawer saat terbuka (ISSUE-008).
const TRIGGER_GAP = css.layout.space.xs;
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
      <MuiBox
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          width: "100%",
          overflowWrap: "anywhere",
        }}
      >
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
  // Portal + mode-auto butuh mount (hindari hydration mismatch: server
  // tak render portal; pola noSsr MUI mengembalikan nilai asli saat render
  // pertama klien vs default di server).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const resolved =
    mode === "auto"
      ? // SSR-aman: server + render pertama = docked (cocok hidrasi);
        // overlay hanya setelah mount.
        !mounted || isDesktop
        ? "docked"
        : "overlay"
      : mode;

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
  // Pemicu toggle: tutup via tab tepi / backdrop / Escape / pilihan.
  // Blur dulu: fokus tak boleh tertahan di pemicu (di luar dialog) saat
  // modal meng-aria-hidden-kan page-root — temuan console Chrome mobile.
  const handleTriggerToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    if (overlayOpen) handleClose();
    else handleTriggerOpen();
  };

  if (resolved === "overlay") {
    const openLabel = ariaLabel ? `Tutup ${ariaLabel}` : "Tutup navigasi";
    const closedLabel = ariaLabel ? `Buka ${ariaLabel}` : "Buka navigasi";
    return (
      <>
        <Drawer
          open={overlayOpen}
          onClose={handleClose}
          id={id}
          aria-label={ariaLabel}
          paperHeight={overlayHeight === "content" ? "auto" : "full"}
        >
          <MuiBox
            sx={{
              display: "flex",
              flexDirection: "column",
              width: OVERLAY_WIDTH,
              // full = drawer penuh; content = bungkus isi (paper Drawer
              // ikut memendek + tengah vertikal via paperHeight).
              height: overlayHeight === "full" ? "100%" : "auto",
              maxHeight: overlayHeight === "full" ? "100dvh" : "90dvh",
              // Napas isi dari tepi paper (khusus overlay; docked punya
              // padding konten milik konsumen masing-masing).
              padding: css.layout.space.sm,
              color: css.colors.textPrimary,
              fontFamily: "inherit",
              // content = paper setinggi isi; bila meluap (68 tombol di HP),
              // scroll di dalam paper — bukan kepotong. full = paper yang
              // scroll, isi terkunci 100%.
              overflowX: "hidden",
              overflowY: overlayHeight === "content" ? "auto" : "hidden",
            }}
          >
            <SidebarBody header={header} footer={footer}>
              {children}
            </SidebarBody>
          </MuiBox>
        </Drawer>
        {/* Satu IconButton portal untuk buka+tutup (ISSUE-008): fixed
            setinggi tepi drawer, meluncur SINKRON dengan paper (durasi+easing
            = transisi Slide MUI) — bukan muncul instan. Tertutup: mundur
            selebar drawer hingga x≈0. Portal lepas dari paper (overflowY auto
            memotong) dan stacking context — tanpa z-war. */}
        {trigger !== "none" &&
          mounted &&
          typeof document !== "undefined" &&
          createPortal(
            <MuiBox
              sx={{
                position: "fixed",
                // Terbuka: 4px dari tepi drawer (napas); tertutup: mundur
                // selebar drawer hingga tepi layar (flush, seperti semula).
                left: `calc(${OVERLAY_WIDTH} + ${TRIGGER_GAP})`,
                top: "50%",
                transform: `translateY(-50%)${
                  overlayOpen ? "" : ` translateX(calc(-1 * (${OVERLAY_WIDTH})))`
                }`,
                transition: overlayOpen
                  ? "transform 225ms cubic-bezier(0, 0, 0.2, 1)"
                  : "transform 195ms cubic-bezier(0.4, 0, 1, 1)",
                zIndex: 1400,
              }}
            >
              <IconButton
                variant="primary"
                aria-label={overlayOpen ? openLabel : closedLabel}
                onClick={handleTriggerToggle}
                icon={
                  overlayOpen ? (
                    <ChevronLeftIcon sx={{ fontSize: 18 }} />
                  ) : trigger === "hamburger" ? (
                    <MenuIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <ChevronRightIcon sx={{ fontSize: 18 }} />
                  )
                }
              />
            </MuiBox>,
            document.body,
          )}
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
