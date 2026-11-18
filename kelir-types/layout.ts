import type * as React from "react";

// 24. Direction
// 24. Direction - sealed text direction (Gel.3c-6 STYLE.md §6).
// `dir` mandatory MEANING; `children` slot. No style/sx/className.
export interface DirectionProps {
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}

// 65. Stack — vertical/horizontal layout primitive (P1b STYLE.md).
// Closed-union gap from token css.layout.space; `align`/`justify` closed-union
// flex alignment (logical values, RTL-correct); `wrap?` → flex-wrap
// (default `false`); `reverseMd?` reverses child order at widths >= 768px
// (token heroCollapse, default `false`); `minHeight?` includes `screen`
// (= 100dvh) for a single-screen hero/interstitial. Default = legacy behavior
// (no visual change). No colors/border/shadow.
export interface StackProps {
  children: React.ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  // Gap at widths >= 768px (token heroCollapse); none = `gap` applies at
  // all widths (legacy behavior).
  gapMd?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  direction?: "row" | "column";
  directionMd?: "row" | "column";
  reverseMd?: boolean;
  minHeight?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "screen";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
  wrap?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 66. Grid — column layout primitive (P1b STYLE.md).
// Closed-union columns (not a free number); gap from css.layout.space.
export interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  // Column count at widths >= 600px / >= 768px (token layout mobile &
  // heroCollapse; `columnsMd` wins when both match). Closed union,
  // not a free number - same as `columns`.
  columnsSm?: 1 | 2 | 3 | 4 | 6 | 12;
  columnsMd?: 1 | 2 | 3 | 4 | 6 | 12;
  // Auto-fit: minimum item width from tokens (sm 200px / md 320px); the
  // column count follows the container width. When set, it replaces columns*.
  minItem?: "sm" | "md";
  // Two-panel layout: `aside` = fixed column (asideWidth) + flexible content
  // at widths >= the collapse threshold; below it a single column. `pinned` =
  // both panels share a fixed height (680px, max 100dvh-48px) with their own
  // internal scrolling, desktop only.
  template?: "auto" | "aside";
  asideWidth?: "sm" | "md" | "lg";
  collapse?: "md" | "lg";
  pinned?: boolean;
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  id?: string;
  "aria-label"?: string;
}

// 67. Spacer — semantic vertical spacing (P1b STYLE.md).
// Closed-union size from token css.layout.space.
export interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg";
  id?: string;
}

// 68. Container — page width container (P1b STYLE.md).
// `maxWidth?` MEANING (sm/md/lg/xl → kit-owned px, default xl = token
// container); `padding?` page gutter from token css.layout.space
// (default xl = token sidePadding). `paddingBlock?` vertical breathing room
// from the same space scale (`none` = 0, default `none`); `clip?` clips
// overflowing content (`overflow: hidden`, default `false`). Pure layout:
// no colors/border/shadow/font. No ...rest/style/sx/className.
export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  padding?: "sm" | "md" | "lg" | "xl" | "2xl";
  paddingBlock?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  paddingBlockMd?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  clip?: boolean;
  id?: string;
  "aria-label"?: string;
}