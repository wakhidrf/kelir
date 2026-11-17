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

// Kit-owned width (ISSUE-005): overlay maxes out at half the page.
const SIDEBAR_WIDTH = "var(--sidebar-width, 260px)";
const OVERLAY_WIDTH = `min(${SIDEBAR_WIDTH}, 75vw)`;
// Breathing room for the trigger tab from the drawer edge when open (ISSUE-008).
const TRIGGER_GAP = css.layout.space.xs;
// Internal kit breakpoint (MUI md); not a consumer number.
const DESKTOP_QUERY = "(min-width: 900px)";

function SidebarBody({
  header,
  footer,
  children,
}: Pick<SidebarProps, "header" | "footer" | "children">) {
  return (
    <>
      {header && <MuiBox sx={{ flexShrink: 0 }}>{header}</MuiBox>}
      {/* Kit-to-kit internal composition: the middle area fills the remaining space and
          scrolls within (ScrollArea bounded via maxHeight 100% when the root is
          bounded; when the root isn't bounded, content grows with the page). */}
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
  triggerVariant = "none",
  overlayHeight = "full",
  id,
  "aria-label": ariaLabel,
}: SidebarProps) {
  // noSsr + defaultMatches: server & first render are the same (docked),
  // corrected after mount — no hydration mismatch.
  const isDesktop = useMediaQuery(DESKTOP_QUERY, {
    defaultMatches: true,
    noSsr: true,
  });
  // Portal + mode-auto need mount (avoid hydration mismatch: the server
  // doesn't render the portal; MUI's noSsr pattern returns the original value
  // on first client render vs the default on the server).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const resolved =
    mode === "auto"
      ? // SSR-safe: server + first render = docked (matches hydration);
        // overlay only after mount.
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
  // Toggle trigger: close via edge tab / backdrop / Escape / selection.
  // Blur first: focus must not stay on the trigger (outside the dialog) when
  // the modal aria-hides the page root — a Chrome mobile console finding.
  const handleTriggerToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    if (overlayOpen) handleClose();
    else handleTriggerOpen();
  };

  if (resolved === "overlay") {
    const openLabel = ariaLabel ? `Close ${ariaLabel}` : "Close navigation";
    const closedLabel = ariaLabel ? `Open ${ariaLabel}` : "Open navigation";
    return (
      <>
        <Drawer
          open={overlayOpen}
          onClose={handleClose}
          id={id}
          aria-label={ariaLabel}
          height={overlayHeight === "auto" ? "auto" : "full"}
        >
          <MuiBox
            sx={{
              display: "flex",
              flexDirection: "column",
              width: OVERLAY_WIDTH,
              // full = full drawer; auto = wrap content (Drawer
              // paper shrinks accordingly + vertically centered via height).
              height: overlayHeight === "full" ? "100%" : "auto",
              maxHeight: overlayHeight === "full" ? "100dvh" : "90dvh",
              // Content breathing room from the paper edge (both branches in parity; docked
              // used to sit flush to the frame — sealed consumers can't
              // add it themselves).
              padding: css.layout.space.sm,
              color: css.colors.textPrimary,
              fontFamily: "inherit",
              // auto = paper as tall as its content; when it overflows (68 buttons on mobile),
              // scroll inside the paper — not clipped. full = a scrolling paper,
              // content locked to 100%.
              overflowX: "hidden",
              overflowY: overlayHeight === "auto" ? "auto" : "hidden",
            }}
          >
            <SidebarBody header={header} footer={footer}>
              {children}
            </SidebarBody>
          </MuiBox>
        </Drawer>
        {/* One portal IconButton for open+close (ISSUE-008): fixed
            at drawer-edge height, slides IN SYNC with the paper (duration+easing
            = MUI Slide transition) — not an instant appear. Closed: recedes
            by the drawer width until x≈0. Portal is free of the paper (overflowY auto
            clips) and stacking context — no z-war. */}
        {triggerVariant !== "none" &&
          mounted &&
          typeof document !== "undefined" &&
          createPortal(
            <MuiBox
              sx={{
                position: "fixed",
                // Open: 4px from the drawer edge (breathing room); closed: recedes
                // by the drawer width to the screen edge (flush, as before).
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
                    ) : triggerVariant === "hamburger" ? (
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
      // Inline (not sx) so parity is testable in JSDOM; value = the same token
      // as overlay (parity fix #40).
      style={{ padding: css.layout.space.sm }}
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        // Follow the parent when bounded (e.g. a 680px showcase box → internal
        // scroll); when unbounded, grow with the page; constrained to
        // the viewport so it's never taller than the screen.
        height: "100%",
        maxHeight: "100dvh",
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        backgroundColor: css.colors.surface,
        // Flush to the viewport edge: screen-side corners zero (logical, RTL-safe),
        // content-side keeps the radius token; the screen-side border isn't drawn.
        borderRadius: css.radius.card,
        borderStartStartRadius: 0,
        borderEndStartRadius: 0,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        borderInlineStart: "none",
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
