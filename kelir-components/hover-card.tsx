import Popper from "@mui/material/Popper";
import * as React from "react";
import type { HoverCardProps } from "../kelir-types";
import { css } from "../kelir-variants";

const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function HoverCard({ trigger, children, ...props }: HoverCardProps) {
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
      {...props}
      style={{
        display: "inline-block",
        position: "relative",
        ...props.style,
      }}
    >
      <button
        ref={triggerRef}
        type="button"
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
        style={{
          display: "inline-block",
          padding: 0,
          border: "none",
          background: "transparent",
          color: "inherit",
          font: "inherit",
          cursor: "pointer",
        }}
      >
        {trigger}
      </button>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: css.layout.zIndex.overlay }}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <div
          style={{
            maxWidth: "280px",
            padding: `${css.layout.space.md} ${css.layout.space.lg}`,
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.sm,
            boxShadow: css.shadows.card,
            border: `1px solid ${css.border.medium}`,
            color: textPrimary,
            fontFamily: "inherit",
            fontSize: "14px",
          }}
        >
          {children}
        </div>
      </Popper>
    </div>
  );
}
