"use client";

import MuiCollapse from "@mui/material/Collapse";
import * as React from "react";
import type { CollapsibleProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Collapsible sealed (Gel.3c-6 STYLE.md §6): trigger slot TEKS — kit yang
// me-render pemicu + menangani klik (tanpa cloneElement ke konsumen).
// open TERKONTROL + defaultOpen + onOpenChange semantik.
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
