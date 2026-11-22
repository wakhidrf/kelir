import type * as React from "react";
import type { KitSize } from "./kit-size";
import type { KitIdentity, KitStatus } from "./kit-tone";

// 5. Attachment
// 5. Attachment - sealed file card (Gel.3c-7 STYLE.md §6).
// `name` TEXT; `size?`/`type?`/`url?` strings; `status?` MEANING;
// `progress?` number 0-100; `onRemove?` event-free semantics.
// No style/sx/className.
export interface AttachmentProps {
  name: string;
  size?: string;
  type?: string;
  url?: string;
  status?: "uploading" | "success" | "error" | "idle";
  progress?: number;
  onRemove?: () => void;
}

// 27. Empty
// 27. Empty — sealed empty state (Gel.3c STYLE.md §6).
// `title?/description?` TEXT slots; `action?/icon?` ReactNode slots.
// No ...rest/style/sx/className/onClick.
export interface EmptyProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 69. Image — neutral sealed media (P1b STYLE.md).
// `src` required; `alt?` always rendered as an attribute (empty string when
// not set → passes axe image-alt). `height?` MEANING (xs..7xl → kit-owned
// px, default md); width follows the original ratio. `fluid?` fills the
// container width (auto height); `maxHeight?`/`maxWidth?` LIMIT (px data,
// TruncatedText.maxWidth precedent). `fit?` (contain/cover, default contain);
// `radius?` from the kit's radius tokens (default none — neutral like Stack,
// no shadow/border). No ...rest/style/sx/className.
export interface ImageProps {
  src: string;
  alt?: string;
  height?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  fluid?: boolean;
  maxHeight?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  maxWidth?: number;
  fit?: "contain" | "cover";
  radius?: "none" | "sm" | "md" | "lg";
  // Fully fills a positioned container (e.g. inside AspectRatio): position
  // absolute + inset 0 + 100% - replaces the consumer fill pattern.
  fill?: boolean;
  // Earlier load (loading eager + fetchPriority high) for media above the
  // fold; default false = the browser's default behavior.
  priority?: boolean;
  // Display-size hint for source selection (the `sizes` attribute).
  sizes?: string;
  id?: string;
  "aria-label"?: string;
}

// 74. Tile — sealed icon/logo tile (P1b STYLE.md).
// `tone?` MEANING (`primary|secondary|plain`, default `primary`): background +
// text from tokens (plain = surface + subtle border for a logo over a
// surface). No `size?` = flexible icon tile (token padding);
// `size?` MEANING (`sm|md|lg` → kit-owned 32/48/64 px) = fixed-size box
// for logos. Token radius; no shadow. No ...rest/style/sx/className.
export interface TileProps {
  children: React.ReactNode;
  tone?: Extract<KitIdentity, "primary" | "secondary" | "plain">;
  size?: KitSize;
  id?: string;
  "aria-label"?: string;
}

// 75. Banner — sealed centered status banner (P1b STYLE.md).
// `tone?` MEANING (subset of KitTone: neutral/warning/error, default neutral):
// kit-owned bg/fg pair (Marker-note precedent: solid, not a raw color);
// child text inherits the color. Centered. No icon (that's `Alert`).
// No ...rest/style/sx/className.
export interface BannerProps {
  children: React.ReactNode;
  tone?: Extract<KitStatus | "neutral", "neutral" | "warning" | "error">;
  id?: string;
  "aria-label"?: string;
}