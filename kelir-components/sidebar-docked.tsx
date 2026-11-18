"use client";

import MuiBox from "@mui/material/Box";
import type { SidebarProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { SidebarBody } from "./sidebar-body";

const SIDEBAR_WIDTH = "var(--sidebar-width, 260px)";

export function SidebarDocked({
  header,
  footer,
  children,
  id,
  ariaLabel,
}: {
  header: SidebarProps["header"];
  footer: SidebarProps["footer"];
  children: SidebarProps["children"];
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <MuiBox
      component="nav"
      id={id}
      aria-label={ariaLabel}
      style={{ padding: css.layout.space.sm }}
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100%",
        maxHeight: "100dvh",
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        backgroundColor: css.colors.surface,
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