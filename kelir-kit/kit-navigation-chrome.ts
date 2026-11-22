import type * as React from "react";

// 19. Command
// 19. Command - sealed command palette (Gel.3c-8 STYLE.md §6).
// `placeholder?` TEXT; `groups` CommandGroup[] (filter + kit-owned visuals;
// each item `onSelect?` event-free semantics). No style/sx/className.
export interface CommandItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
}
export interface CommandGroup {
  heading: string;
  items: CommandItem[];
}
export interface CommandProps {
  placeholder?: string;
  groups: CommandGroup[];
}

// 51. Sidebar
// 51. Sidebar — sealed side navigation (Gel.3c STYLE.md §6; responsive ISSUE-005).
// `header?/footer?/children` slots; `mode` decides docked-vs-overlay
// (auto = docked ≥ md 900px, overlay below that); `open` only for overlay
// (controlled + uncontrolled via defaultOpen); `triggerVariant` kit-owned
// edge trigger specifically for overlay (none/hamburger/chevron) — a button
// style union, not a slot (other components' trigger slots are unrelated);
// `overlayHeight`
// full/auto overlay-specific (`none` = button alone, use a native element);
// width/height owned by the kit; sm inner spacing in docked equals overlay
// (parity fix: docked previously hugged the frame). No ...rest/style.
export interface SidebarProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  mode?: "auto" | "docked" | "overlay";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerVariant?: "none" | "hamburger" | "chevron";
  overlayHeight?: "full" | "auto";
  id?: string;
  // Required: the nav landmark needs a name (open/close buttons derive it).
  "aria-label": string;
}

// 57. Tabs
// 57. Tabs — controlled/uncontrolled tabs based on MUI (Gel.3c-2 §6).
// `items` label/value strings + content; `value?/defaultValue?/onChange?(string)`
// semantic (no event). No ...rest/style/sx/className.
export interface TabsItem {
  label: string;
  content: React.ReactNode;
  value: string;
}
export interface TabsProps {
  items: TabsItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  id?: string;
  "aria-label"?: string;
}

// 76. Link — sealed inline link (P1b STYLE.md).
// `href` required (without it use `Button variant="ghost"`); text + icons
// inline owned by the kit (`external?` → new-window icon + `target _blank` +
// `rel noopener`, default `false` → arrow icon). textPrimary color,
// no underline. No ...rest/style/sx/className.
export interface LinkProps {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  // `icon?` link icon display: `auto` (default) = arrow/new-window, `none` = text only.
  icon?: "auto" | "none";
  id?: string;
  "aria-label"?: string;
}