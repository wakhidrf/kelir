"use client";

import Popper from "@mui/material/Popper";
import type * as React from "react";
import { css } from "../kelir-kit/kit-create-css";

const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;

type HoverCardPanelProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
};

export function HoverCardPanel({
  open,
  anchorEl,
  onMouseEnter,
  onMouseLeave,
  children,
}: HoverCardPanelProps) {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      style={{ zIndex: css.layout.zIndex.overlay }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          maxWidth: "280px",
          padding: `${css.layout.space.md} ${css.layout.space.lg}`,
          backgroundColor: neumorphicBg,
          borderRadius: css.radius.surface,
          boxShadow: css.shadows.card,
          border: `1px solid ${css.border.medium}`,
          backdropFilter: surfaceBlur,
          WebkitBackdropFilter: surfaceBlur,
          color: textPrimary,
          fontFamily: "inherit",
          fontSize: "14px",
        }}
      >
        {children}
      </div>
    </Popper>
  );
}