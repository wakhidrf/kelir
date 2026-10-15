"use client";

import MuiMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import type { ContextMenuProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function ContextMenu({
  trigger,
  menuItems,
  truncate = false,
}: ContextMenuProps) {
  const [anchorPosition, setAnchorPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);

  const open = anchorPosition !== null;

  function handleContextMenu(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
  }

  return (
    <>
      {/* Area klik-kanan milik kit: trigger TEKS, event ditangani kit. */}
      <div
        onContextMenu={handleContextMenu}
        title={truncate ? trigger : undefined}
        style={{
          display: "inline-block",
          ...(truncate
            ? {
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }
            : null),
        }}
      >
        {trigger}
      </div>
      <MuiMenu
        open={open}
        onClose={() => setAnchorPosition(null)}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        slotProps={{
          paper: {
            style: {
              backgroundColor: neumorphicBg,
              borderRadius: css.radius.surface,
              boxShadow: convexShadow,
              border: `1px solid ${css.border.light}`,
              backdropFilter: surfaceBlur,
              WebkitBackdropFilter: surfaceBlur,
              fontFamily: "inherit",
              padding: css.layout.space.xs,
            },
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={`context-menu-${item.label}`}
            onClick={() => {
              setAnchorPosition(null);
              item.onClick?.();
            }}
            style={{
              color: textPrimary,
              fontSize: "14px",
              borderRadius: css.radius.button,
              gap: css.layout.space.sm,
            }}
          >
            {item.icon && (
              <span style={{ color: textSecondary, display: "inline-flex" }}>
                {item.icon}
              </span>
            )}
            {item.label}
          </MenuItem>
        ))}
      </MuiMenu>
    </>
  );
}
