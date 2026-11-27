import type * as React from "react";
import type { KitAlign } from "./kit-align";
import type { KitButtonType } from "./kit-button-type";
import type { KitShape } from "./kit-shape";
import type { KitSize } from "./kit-size";
import type { KitIdentity } from "./kit-tone";
import type { KitVariant } from "./kit-variant";

// 1. Accordion - sealed collapsible based on MUI (Gel.3c-6 STYLE.md §6).
// `summary` TEXT slot; `details` CONTENT slot (text or interactive elements);
// `expanded?` CONTROLLED + `defaultExpanded?` + `onChange?(expanded)`; `disabled?`; `active?`.
// No children/slotProps/style/sx/className/onChange-event-MUI.
export interface AccordionProps {
  summary: string;
  details: React.ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onChange?: (expanded: boolean) => void;
  disabled?: boolean;
  active?: boolean;
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
  variant?: KitVariant;
  // Content alignment (full-width buttons e.g. nav): center (default), start,
  // or end. Logical values (LTR+RTL). `justify` excluded (never a full-width block).
  align?: Extract<KitAlign, "start" | "center" | "end">;
  // Kit-owned sizes (shared KitSize): xs tightest (in-table), sm tight, md
  // (default) = today, lg roomy; xl..3xl degrade to lg. Closed, no free numbers.
  size?: KitSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: KitButtonType;
  disabled?: boolean;
  // Allowed, BUT must prefix the visible text (WCAG 2.5.3 Label in Name).
  // React 19 types tolerate all aria-* so rejection can't be type-tested
  // — enforced via review (§2, §11).
  "aria-label"?: string;
  "aria-describedby"?: string;
  id?: string;
}

// 10c. Icon - decorative icon wrapper (P1c STYLE.md 6): color from token
// (`tone`) + size from kit scale (`size`); icon element via `children`. No
// `aria-label` = decorative; accessible label stays with the parent link/button.
export interface IconProps {
  children: React.ReactElement;
  tone?: Extract<KitIdentity, "inherit" | "primary" | "secondary" | "accent">;
  size?: KitSize;
  id?: string;
  "aria-label"?: string;
}

// 10b. IconButton — icon-only button (P1c STYLE.md §6): icon + aria-label
// required (WCAG 2.5.3 enforced by the component shape).
export interface IconButtonProps {
  icon: React.ReactNode;
  "aria-label": string;
  variant?: KitVariant;
  // Frame shape: rounded (default, follows role token), circle, square.
  shape?: KitShape;
  // Kit-owned sizes (Button counterpart): sm tight, md (default) = today,
  // lg roomy; shared KitSize (xs smaller, xl..3xl degrade to lg). Closed.
  size?: KitSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: KitButtonType;
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