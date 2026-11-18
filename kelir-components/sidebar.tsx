"use client";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import type { SidebarProps } from "../kelir-types";
import { SidebarBody } from "./sidebar-body";
import { SidebarDocked } from "./sidebar-docked";
import { SidebarOverlay } from "./sidebar-overlay";

const DESKTOP_QUERY = "(min-width: 900px)";

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
  const isDesktop = useMediaQuery(DESKTOP_QUERY, {
    defaultMatches: true,
    noSsr: true,
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const resolved =
    mode === "auto"
      ? !mounted || isDesktop
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
  const handleTriggerToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    if (overlayOpen) handleClose();
    else handleTriggerOpen();
  };

  if (resolved === "overlay") {
    return (
      <SidebarOverlay
        header={header}
        footer={footer}
        overlayOpen={overlayOpen}
        overlayHeight={overlayHeight}
        triggerVariant={triggerVariant}
        id={id}
        ariaLabel={ariaLabel}
        mounted={mounted}
        handleClose={handleClose}
        handleTriggerToggle={handleTriggerToggle}
      >
        {children}
      </SidebarOverlay>
    );
  }

  return (
    <SidebarDocked
      header={header}
      footer={footer}
      id={id}
      ariaLabel={ariaLabel}
    >
      {children}
    </SidebarDocked>
  );
}

// Keep SidebarBody re-exported for backward compatibility
export { SidebarBody } from "./sidebar-body";