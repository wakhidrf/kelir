import type * as React from "react";

// 1. Accordion
// 1. Accordion - sealed collapsible based on MUI (Gel.3c-6 STYLE.md §6).
// `summary`/`details` TEXT slots; `expanded?` CONTROLLED + `defaultExpanded?`
// + `onChange?(expanded)` event-free semantics; `disabled?`.
// No children/slotProps/style/sx/className/onChange-event-MUI.
export interface AccordionProps {
  summary: string;
  details: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onChange?: (expanded: boolean) => void;
  disabled?: boolean;
}

// 10. Button — explicit sealed (P1c STYLE.md §6): no MUI inheritance,
// children string + icon slot. type default "button"; "reset" is
// intentionally absent (request via kelir-request).
export interface ButtonProps {
  children: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  // Node at the end of the row (e.g. Badge), pushed right by flex;
  // differs from endIcon which uses the MUI icon slot (font-size 20px).
  endContent?: React.ReactNode;
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  // Content alignment (for full-width buttons e.g. nav): center (default,
  // icon+text centered), start (flush start, straight icon column), or end.
  // Logical values: correct in both LTR and RTL.
  align?: "center" | "start" | "end";
  // Kit-owned sizes (for narrow drawers e.g. mobile nav): xs = tightest
  // padding + 11px text + ~14px icons (actions inside table cells),
  // sm = tight padding + ~18px icons, md (default) = today's behavior,
  // lg = roomy + ~28px icons. Closed union, no free numbers.
  size?: "xs" | "sm" | "md" | "lg";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  // Allowed, BUT must prefix the visible text (WCAG 2.5.3 Label in Name).
  // React 19 types tolerate all aria-* so rejection can't be type-tested
  // — enforced via review (§2, §11).
  "aria-label"?: string;
  "aria-describedby"?: string;
  id?: string;
}

// 10c. Icon - decorative icon wrapper (P1c STYLE.md 6): color from token
// (`intent`) + size from kit scale (`size`); icon element passed via
// `children`. No `aria-label` = decorative (`aria-hidden` owned by the kit);
// accessible label remains owned by the parent button/link.
export interface IconProps {
  children: React.ReactElement;
  intent?: "inherit" | "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  id?: string;
  "aria-label"?: string;
}

// 10b. IconButton — icon-only button (P1c STYLE.md §6): icon + aria-label
// required (WCAG 2.5.3 enforced by the component shape).
export interface IconButtonProps {
  icon: React.ReactNode;
  "aria-label": string;
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  // Frame shape: rounded (default, follows role token), circle, square.
  shape?: "rounded" | "circle" | "square";
  // Kit-owned sizes (Button counterpart): sm = padding 6 + ~18px icon,
  // md (default) = today's behavior, lg = padding 14 + ~28px icon.
  // Closed union, no free numbers.
  size?: "sm" | "md" | "lg";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-describedby"?: string;
  id?: string;
}

// 11. ButtonGroup — sealed button group based on MUI (Gel.3b STYLE.md §6).
// `children` Kelir buttons; `disabled?` BEHAVIOR. No ...rest/style/sx.
export interface ButtonGroupProps {
  children: React.ReactNode;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 17. Collapsible
// 17. Collapsible - sealed collapsible based on MUI Collapse (Gel.3c-6 STYLE.md §6).
// `trigger` TEXT slot (the kit renders it + handles the click);
// `open?` CONTROLLED + `defaultOpen?` + `onOpenChange?(open)` semantic.
// No cloneElement/consumer-onClick/style/sx/className.
export interface CollapsibleProps {
  trigger: string;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}