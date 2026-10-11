"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MuiBox from "@mui/material/Box";
import MuiIconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

// Tab tepi pemicu (ISSUE-008): 28x64, sudut kanan ikut token peran.
// Tanpa shadow: di atas backdrop shadow justru terlihat seperti blur kotor.
function TriggerTab({
  label,
  expanded,
  controlsId,
  onToggle,
  icon,
}: {
  label: string;
  expanded: boolean;
  controlsId?: string;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: React.ReactNode;
}) {
  return (
    <MuiIconButton
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onToggle}
      disableRipple
      sx={{
        width: "28px",
        height: "64px",
        padding: 0,
        borderRadius: 0,
              borderTopRightRadius: css.radius.button,
              borderBottomRightRadius: css.radius.button,
              // Menyambung dengan paper Drawer: resep SAMA PERSIS (surface +
              // blur + border) agar tab terbaca sebagai lanjutan drawer,
              // bukan tombol lepas.
              backgroundColor: css.colors.surface,
              backdropFilter: css.motion.blur.backdrop,
              WebkitBackdropFilter: css.motion.blur.backdrop,
              border: `1px solid ${css.border.light}`,
              borderLeft: "none",
        color: css.colors.textPrimary,
        // Tab statis: tanpa cucian hover/ripple MUI (temuan visual mobile).
        "&:hover": {
          backgroundColor: css.colors.baseBackground,
        },
      }}
    >
      {icon}
    </MuiIconButton>
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
  // Portal butuh mount (hindari hydration mismatch: server tak render portal).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
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
    const openLabel = ariaLabel ? `Tutup ${ariaLabel}` : "Tutup navigasi";
    const closedLabel = ariaLabel ? `Buka ${ariaLabel}` : "Buka navigasi";
    return (
      <>
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
        {/* Satu tab portal untuk buka+tutup: fixed setinggi tepi drawer,
            meluncur SINKRON dengan paper (durasi+easing = transisi Slide MUI:
            buka 225ms ease-out, tutup 195ms ease-in) — bukan muncul instan.
            Tertutup: mundur selebar drawer hingga x≈0 (titik tepi layar).
            Portal lepas dari paper (overflowY auto memotong left:100%) dan
            dari stacking context mana pun — tanpa z-war. */}
        {trigger !== "none" &&
          mounted &&
          typeof document !== "undefined" &&
          createPortal(
            <MuiBox
              sx={{
                position: "fixed",
                left: OVERLAY_WIDTH,
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
              <TriggerTab
                label={overlayOpen ? openLabel : closedLabel}
                expanded={overlayOpen}
                controlsId={id}
                onToggle={handleTriggerToggle}
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
