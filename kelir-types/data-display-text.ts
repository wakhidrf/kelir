import type * as React from "react";

// 9. Bubble
// 9. Bubble - sealed chat bubble (Gel.3c-7 STYLE.md §6).
// `variant?`/`align?` MEANING; `reactions?` string[]; `collapsible?` internal
// fold behavior; `children` message content slot. No style/sx/className.
export interface BubbleProps {
  variant?: "sent" | "received";
  align?: "start" | "end";
  reactions?: string[];
  collapsible?: boolean;
  children: React.ReactNode;
}

// 36. Marker — sealed semantic marker based on MUI (P1c STYLE.md §6).
// `variant` shape (status/note/border/separator); `intent` MEANING
// (primary/secondary/error/success/warning) — not raw `color`.
// No style/className/HTML events — all visuals from kit tokens.
export interface MarkerProps {
  variant?: "status" | "note" | "border" | "separator";
  intent?: "primary" | "secondary" | "error" | "success" | "warning";
  children: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 38. Message
// 38. Message — sealed chat bubble (Gel.3b STYLE.md §6).
// `sender/time?/text` TEXT slots; `avatar?` media slot; `align?` MEANING.
// No ...rest/style/sx/className/onClick.
export interface MessageProps {
  avatar?: React.ReactNode;
  sender: string;
  time?: string;
  text: string;
  align?: "start" | "end";
  id?: string;
  "aria-label"?: string;
}

// 39. Message Scroller
// 39. MessageScroller - sealed message scroll (Gel.3c-9 STYLE.md §6).
// `children` message slot; `onLoadMore?`/`hasMore?` load-more BEHAVIOR;
// `maxHeight?` BEHAVIOR (kit-owned default). Scrollbar owned by the kit.
export interface MessageScrollerProps {
  children: React.ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  maxHeight?: string | number;
}

// 78. TruncatedText
// 78. TruncatedText - sealed single-line ellipsis text (#56).
// `text` TEXT slot (required); `maxWidth?` DATA (px, kit-owned width limit;
// none = full container width); `title` hover = full text owned by the kit;
// `id?`/`aria-label?` standard. No ...rest/style/sx/className.
export interface TruncatedTextProps {
  text: string;
  maxWidth?: number;
  id?: string;
  "aria-label"?: string;
}

// 79. List — sealed semantic list (structured content/markdown).
// `items` per-item node slot (required, ordered); `ordered?` list MEANING
// (default `false` = bullet, `true` = numbered). Markers, spacing, and
// colors owned by the kit. No ...rest/style/sx/className.
export interface ListProps {
  items: React.ReactNode[];
  ordered?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 80. Quote — sealed blockquote.
// `children` quote content slot (required). Accent bar + background + radius
// owned by the kit. No ...rest/style/sx/className.
export interface QuoteProps {
  children: React.ReactNode;
  variant?: "default" | "plain";
  align?: "start" | "center";
  id?: string;
  "aria-label"?: string;
}

// 81. CodeBlock — sealed code block + kit-owned copy button.
// `code` code text (required); `language?` language label (none = "code");
// `copyLabel?`/`copiedLabel?` button labels (default "Copy"/"Copied");
// copy behavior (clipboard + fallback) owned by the kit. No ...rest/style/sx/className.
export interface CodeBlockProps {
  code: string;
  language?: string;
  copyLabel?: string;
  copiedLabel?: string;
  id?: string;
  "aria-label"?: string;
}