import type * as React from "react";

// 8. Breadcrumb
// 8. Breadcrumb — sealed breadcrumb navigation based on MUI (Gel.3c-4 §6).
// `items` TEXT labels + href?/active? MEANING. No ...rest/style/sx.
export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  id?: string;
  "aria-label"?: string;
}

// 20. Context Menu
// 20. ContextMenu - sealed right-click menu based on MUI (Gel.3c-8 STYLE.md §6).
// `trigger` TEXT slot (the kit renders the right-click area + handles the event,
// no cloneElement); `menuItems` ContextMenuItem[] (`onClick?` semantic).
// `truncate?` = kit-owned trigger ellipsis (default `false`; hover title =
// full text).
// Position + visuals owned by the kit. No style/sx/className/slotProps.
export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}
export interface ContextMenuProps {
  trigger: string;
  menuItems: ContextMenuItem[];
  truncate?: boolean;
  maxWidth?: number;
}

// 26. Dropdown Menu
// 26. DropdownMenu - sealed click menu based on MUI (Gel.3c-9 STYLE.md §6).
// `trigger` TEXT slot (the kit renders the trigger button + handles the click,
// no cloneElement, Collapsible/ContextMenu precedent); `triggerVariant?`
// MEANING (`text|button`, default `text`): text = today's plain text button;
// button = the trigger rendered as the kit's outline Button (a button
// affordance for toolbars). `truncate?` = kit-owned trigger ellipsis
// (default `false`; only the `text` variant, the `button` variant ignores
// it; hover title = full text). `items`
// DropdownMenuItem[] (`onClick?` semantic). Position + visuals owned by the kit.
export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
}
export interface DropdownMenuProps {
  trigger: string;
  triggerVariant?: "text" | "button";
  items: DropdownMenuItem[];
  truncate?: boolean;
  maxWidth?: number;
}

// 37. Menubar
// 37. Menubar - sealed menu bar based on MUI (Gel.3c-9 STYLE.md §6).
// `menus` MenubarMenu[] (trigger TEXT + items; `onClick?` semantic).
// Open menus + visuals owned by the kit. No style/sx/className.
export interface MenubarItem {
  label: string;
  onClick?: () => void;
}
export interface MenubarMenu {
  trigger: string;
  items: MenubarItem[];
}
export interface MenubarProps {
  menus: MenubarMenu[];
}

// 41. Navigation Menu
// 41. NavigationMenu - sealed navigation menu (Gel.3c-9 STYLE.md §6).
// `items` NavigationMenuItem[] (label TEXT; href?/onClick? event-free
// semantics — a zero-arg adapter on the kit side; active? MEANING).
// Visuals owned by the kit.
export interface NavigationMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}
export interface NavigationMenuProps {
  items: NavigationMenuItem[];
}