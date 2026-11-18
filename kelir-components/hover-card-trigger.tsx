"use client";

import type * as React from "react";

type HoverCardTriggerProps = {
  trigger: React.ReactElement;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
};

export function HoverCardTrigger({
  trigger,
  triggerRef,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
}: HoverCardTriggerProps) {
  return (
    <button
      ref={triggerRef}
      type="button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
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
  );
}