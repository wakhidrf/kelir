"use client";

import MuiBox from "@mui/material/Box";
import type { SidebarProps } from "../kelir-kit/kit-navigation-chrome";
import { ScrollArea } from "./scroll-area";

export function SidebarBody({
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