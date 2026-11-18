"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MuiBox from "@mui/material/Box";
import { createPortal } from "react-dom";
import { css } from "../kelir-variants";
import { IconButton } from "./icon-button";

const SIDEBAR_WIDTH = "var(--sidebar-width, 260px)";
const OVERLAY_WIDTH = `min(${SIDEBAR_WIDTH}, 75vw)`;
const TRIGGER_GAP = css.layout.space.xs;

export function SidebarOverlayTrigger({
  overlayOpen,
  triggerVariant,
  mounted,
  handleTriggerToggle,
  ariaLabel,
}: {
  overlayOpen: boolean;
  triggerVariant: "none" | "hamburger" | "chevron";
  mounted: boolean;
  handleTriggerToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}) {
  const openLabel = ariaLabel ? `Close ${ariaLabel}` : "Close navigation";
  const closedLabel = ariaLabel ? `Open ${ariaLabel}` : "Open navigation";

  if (
    triggerVariant === "none" ||
    !mounted ||
    typeof document === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <MuiBox
      sx={{
        position: "fixed",
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
  );
}