"use client";

import Divider from "@mui/material/Divider";
import MuiMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import type { DropdownMenuProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  function handleTriggerClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  return (
    <>
      {/* Tombol pemicu milik kit: trigger TEKS, klik ditangani kit. */}
      <button
        type="button"
        onClick={handleTriggerClick}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          padding: `6px ${css.layout.space.md}`,
          borderRadius: css.radius.button,
          fontSize: "13px",
          fontWeight: 600,
          color: textSecondary,
          fontFamily: "inherit",
        }}
      >
        {trigger}
      </button>
      <MuiMenu
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
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
        {items.map((item) => (
          <React.Fragment key={`dropdown-${item.label}`}>
            {item.divider && (
              <Divider
                style={{
                  backgroundColor: css.divider,
                  margin: `${css.layout.space.xs} 0`,
                }}
              />
            )}
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
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
          </React.Fragment>
        ))}
      </MuiMenu>
    </>
  );
}
