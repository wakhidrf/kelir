import type * as React from "react";

// 4. Aspect Ratio
// 4. AspectRatio - sealed aspect-ratio frame (Gel.3c-6 STYLE.md §6).
// `ratio?` number; `children` media slot (img/video/kit).
// No style/sx/className.
export interface AspectRatioProps {
  ratio?: number;
  children: React.ReactNode;
  // Frame width cap: `maxWidth` px at all widths (e.g. 200) and
  // `maxWidthMobileVw` vw below 600px (e.g. 34) - replaces the consumer's
  // max-width class. Default: full container width.
  maxWidth?: number;
  maxWidthMobileVw?: number;
  // No surface: no kit background/radius/shadow/border (for logo/illustration
  // frames that display as-is), default false.
  plain?: boolean;
}

// 6. Avatar — sealed visual identity based on MUI (Gel.3a STYLE.md §6).
// `src?/alt?/fallbackText?` CONTENT; `size?` MEANING (small/medium/large/xl/2xl/3xl
// → kit-owned px). `frame?` = framed logo (surface background + thick primary
// ring + inner padding) for a mascot floating at a card edge, default
// `false` (legacy behavior). No ...rest/style/sx/className/onClick MUI.
export interface AvatarProps {
  src?: string;
  alt?: string;
  fallbackText?: string;
  size?: "small" | "medium" | "large" | "xl" | "2xl" | "3xl";
  frame?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 7. Badge — sealed status label (Gel.3a STYLE.md §6).
// `variant?` MEANING (default primary); `children` status text.
// No ...rest/style/sx/className/onClick.
export interface BadgeProps {
  variant?: "primary" | "secondary" | "destructive" | "outline";
  children: string;
  id?: string;
  "aria-label"?: string;
}

// 13. Card — sealed card based on MUI (P1c STYLE.md §6).
// Text slots (`title`/`subtitle`) = string; action/content slots
// (`headerActions`/`footer`/`children`) = ReactNode (Kelir button/component).
// `headerAlign` = header title + subtitle alignment (default `start`).
// `scrollable?` = internal scrolling content, header/footer fixed (card
// becomes a flex column; default false; outer height owned by the consumer).
// No style/sx/className/raw colors/fonts — everything from kit tokens.
export interface CardProps {
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  headerAlign?: "start" | "center" | "end";
  scrollable?: boolean;
  overflow?: "hidden" | "visible";
  flag?: "danger" | "warn";
  footer?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 33. Item
// 33. Item — sealed list row based on MUI (Gel.3c-5 STYLE.md §6).
// `title/description?` TEXT slots; `media?/action?` sealed-component slots.
// No ...rest/style/sx/MUI slotProps.
export interface ItemProps {
  title: string;
  description?: string;
  media?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}