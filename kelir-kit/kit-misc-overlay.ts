import type * as React from "react";

// 23. Dialog — sealed dialog based on MUI (P1c STYLE.md §6).
// BEHAVIOR (`open`/`onClose` event-free semantics) owned by the consumer;
// `title` text slot (string); `children`/`actions` content/action slots.
// `disableScrollLock` is a kit decision (hardcoded). No style/sx/className.
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 25. Drawer
// 25. Drawer — sealed side drawer based on MUI (Gel.3c-5 STYLE.md §6).
// `open` FULLY CONTROLLED (required); `onClose` event-free/reason-free
// semantics (Dialog precedent); `title?` TEXT slot; default left anchor
// owned by the kit.
// No ...rest/style/sx/MUI slotProps.
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  // Height: full (default, full-screen drawer) or auto
  // (content wrap + vertical center - e.g. a 3-button compact nav).
  height?: "full" | "auto";
  id?: string;
  "aria-label"?: string;
}

// 29. Hover Card
// 29. HoverCard - sealed hover card based on MUI Popper (Gel.3c-7 STYLE.md §6).
// `trigger` ELEMENT anchor slot (needs a node for positioning, Tooltip
// precedent); `children` content slot.
// Placement + timer + visuals owned by the kit. No style/sx/className.
export interface HoverCardProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
}

// 43. Popover
// 43. Popover — sealed context layer based on MUI (Gel.3c-4 §6).
// `trigger` trigger slot; `open?` FULLY CONTROLLED vs internal (don't pass
// open = manage it yourself); `onClose` event-free/reason-free semantics
// (Dialog precedent).
// anchorEl/position owned by the kit (trigger). No ...rest/style/sx/MUI slotProps.
export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  id?: string;
  "aria-label"?: string;
}

// 50. Sheet
// 50. Sheet — sealed bottom sheet based on MUI (Gel.3c-5 STYLE.md §6).
// Like Drawer + kit-hardcoded bottom anchor (not a Drawer inheritance —
// transitive inheritance is forbidden so each component's contract reads
// independently).
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 77. LoadingOverlay - sealed fullscreen loading overlay based on MUI (#54).
// `open` FULLY CONTROLLED (required); `label?`/`progress?` TEXT slots; `children?` media slot (consumer-owned animation).
// Kit-owned pulsing center card + dim backdrop (fixed pulse rhythm, no prop; backdrop = MUI default).
// No onClose (loading can't be dismissed; Escape/backdrop doesn't close). No ...rest/style/sx/MUI slotProps.
export interface LoadingOverlayProps {
  open: boolean;
  label?: string;
  progress?: string;
  children?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}