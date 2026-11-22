"use client";

import MuiBox from "@mui/material/Box";
import type { SidebarProps } from "../kelir-kit/kit-navigation-chrome";
import { css } from "../kelir-kit/kit-create-css";
import { Drawer } from "./drawer";
import { SidebarBody } from "./sidebar-body";
import { SidebarOverlayTrigger } from "./sidebar-overlay-trigger";

const SIDEBAR_WIDTH = "var(--sidebar-width, 260px)";
const OVERLAY_WIDTH = `min(${SIDEBAR_WIDTH}, 75vw)`;

export function SidebarOverlay({
  header,
  footer,
  children,
  overlayOpen,
  overlayHeight,
  triggerVariant,
  id,
  ariaLabel,
  mounted,
  handleClose,
  handleTriggerToggle,
}: {
  header: SidebarProps["header"];
  footer: SidebarProps["footer"];
  children: SidebarProps["children"];
  overlayOpen: boolean;
  overlayHeight: SidebarProps["overlayHeight"];
  triggerVariant: SidebarProps["triggerVariant"];
  id?: string;
  ariaLabel?: string;
  mounted: boolean;
  handleClose: () => void;
  handleTriggerToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
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
            height: overlayHeight === "full" ? "100%" : "auto",
            maxHeight: overlayHeight === "full" ? "100dvh" : "90dvh",
            padding: css.layout.space.sm,
            color: css.colors.textPrimary,
            fontFamily: "inherit",
            overflowX: "hidden",
            overflowY: overlayHeight === "auto" ? "auto" : "hidden",
          }}
        >
          <SidebarBody header={header} footer={footer}>
            {children}
          </SidebarBody>
        </MuiBox>
      </Drawer>
      <SidebarOverlayTrigger
        overlayOpen={overlayOpen}
        triggerVariant={triggerVariant ?? "none"}
        mounted={mounted}
        handleTriggerToggle={handleTriggerToggle}
        ariaLabel={ariaLabel}
      />
    </>
  );
}