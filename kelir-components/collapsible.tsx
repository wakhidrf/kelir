"use client";

import MuiCollapse from "@mui/material/Collapse";
import * as React from "react";
import type { CollapsibleProps } from "../kelir-kit/kit-actions";
import { css } from "../kelir-kit/kit-create-css";

// Collapsible sealed (Gel.3c-6 STYLE.md §6): TEXT trigger slot - the kit
// renders the trigger + handles the click (no cloneElement to the consumer).
// CONTROLLED open + defaultOpen + semantic onOpenChange.
export function Collapsible({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: CollapsibleProps) {
  const [inner, setInner] = React.useState(defaultOpen);
  const isOpen = open ?? inner;

  function toggle() {
    const next = !isOpen;
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  }

  return (
    <div style={{ fontFamily: "inherit", color: css.colors.textPrimary }}>
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        style={{ cursor: "pointer", display: "inline-block", fontWeight: 600 }}
      >
        {trigger}
      </div>
      <MuiCollapse in={isOpen}>{children}</MuiCollapse>
    </div>
  );
}
