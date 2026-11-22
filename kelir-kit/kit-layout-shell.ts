import type * as React from "react";

// 70. FlexItem — sealed flex item control (P1b STYLE.md).
// The name `Item` is already used for the list row (title/description/media/
// action), so this primitive is named `FlexItem`. `grow?` → `flex: 1,
// minWidth: 0` (default `false`); `shrink?` = `false` → `flexShrink: 0`
// (default `true`); `clip?` → `overflow: hidden` (default `false`, the
// property is fully omitted when off — `Stack wrap?` precedent; natural
// `grow clip` pair = the flex-row truncation pattern). `offsetY?` = pull up
// (negative top margin from space tokens: sm/md/lg) so an element stacks at
// the top edge, e.g. a logo at a card edge. Closed booleans, no free
// numbers. Default = plain block (no flex props). No ...rest/style/sx/className.
export interface FlexItemProps {
  children: React.ReactNode;
  grow?: boolean;
  shrink?: boolean;
  clip?: boolean;
  offsetY?: "sm" | "md" | "lg";
  id?: string;
  "aria-label"?: string;
}

// 71. Shell — admin app-shell viewport shell (P1b STYLE.md).
// `height: 100dvh, overflow: hidden`, row direction (sidebar + content
// side by side) or `stacked?` (column: TopBar + stacked content,
// default `false`). Pure layout: no colors/border/shadow.
// No ...rest/style/sx/className.
export interface ShellProps {
  children: React.ReactNode;
  stacked?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 72. Content — the app-shell's single scroll area (P1b STYLE.md).
// `flex: 1` + internal vertical scroll + responsive padding from tokens
// (desktop roomy, mobile tight; `compact?` forces tight, default
// `false`) + background background. SSR-safe: server + first render =
// desktop, corrected after mount (Sidebar pattern, no mismatch).
// No ...rest/style/sx/className.
export interface ContentProps {
  children: React.ReactNode;
  compact?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 73. TopBar — app-shell mobile bar (P1b STYLE.md).
// `left?`/`right?` slots (nodes; text inside them is a string) aligned
// edge-to-edge; `variant?` MEANING (`raised|flat`, default `raised`):
// raised = a raised Kelir-component-style bar (surface + bottom border +
// shadow); flat = a flush transparent line with no raised surface (an action
// row inside the content). Header landmark. No custom colors/border/shadow.
// No ...rest/style/sx/className.
export interface TopBarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  variant?: "raised" | "flat";
  id?: string;
  "aria-label"?: string;
}

// 79. List — sealed semantic list (structured content/markdown).
// `items` per-item node slot (required, ordered); `ordered?` list MEANING
// (default `false` = bullet, `true` = numbered). Markers, spacing, and
// colors owned by the kit. No ...rest/style/sx/className.
export interface PositionedProps {
  children: React.ReactNode;
  // Fixed points in the viewport (offset from space tokens): top corner,
  // bottom corner (scroll-up trigger), or mid-left edge (mobile swipe trigger).
  anchor?:
    | "top-start"
    | "top-center"
    | "top-end"
    | "bottom-start"
    | "bottom-center"
    | "bottom-end"
    | "center-start";
  // Show at all widths (default), mobile only (<600px), or desktop only
  // (>=600px) - token layout.mobile.
  visibility?: "always" | "mobile" | "desktop";
  // Raise above content (z-index overlay token). Turn off for containers
  // that hold their own sidebar triggers - the z-index creates a stacking
  // context that traps drawer layers.
  elevate?: boolean;
  id?: string;
  "aria-label"?: string;
}

export interface PageFrameProps {
  children: React.ReactNode;
  // Page chrome slots: header (centered, above main), footer (centered,
  // top divider line), overlays (fixed-point trigger/theme-switcher slots).
  header?: React.ReactNode;
  footer?: React.ReactNode;
  overlays?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}