"use client";

import * as React from "react";
import type { HoverCardProps } from "../kelir-types";
import { HoverCardPanel } from "./hover-card-panel";
import { HoverCardTrigger } from "./hover-card-trigger";

export function HoverCard({ trigger, children }: HoverCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = Boolean(anchorEl);

  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setAnchorEl(null), 150);
  }, [cancelClose]);

  React.useEffect(
    () => () => {
      cancelClose();
    },
    [cancelClose],
  );

  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
      }}
    >
      <HoverCardTrigger
        trigger={trigger}
        triggerRef={triggerRef}
        onMouseEnter={() => {
          cancelClose();
          setAnchorEl(triggerRef.current);
        }}
        onMouseLeave={scheduleClose}
        onFocus={() => {
          cancelClose();
          setAnchorEl(triggerRef.current);
        }}
        onBlur={scheduleClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setAnchorEl(triggerRef.current);
          } else if (e.key === "Escape") {
            setAnchorEl(null);
          }
        }}
      />
      <HoverCardPanel
        open={open}
        anchorEl={anchorEl}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {children}
      </HoverCardPanel>
    </div>
  );
}