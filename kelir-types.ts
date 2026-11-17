import type { AccordionProps as MuiAccordionProps } from "@mui/material/Accordion";
import type { AutocompleteProps as MuiAutocompleteProps } from "@mui/material/Autocomplete";
import type { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import type { BadgeProps as MuiBadgeProps } from "@mui/material/Badge";
import type { BreadcrumbsProps as MuiBreadcrumbsProps } from "@mui/material/Breadcrumbs";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import type { ButtonGroupProps as MuiButtonGroupProps } from "@mui/material/ButtonGroup";
import type { DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import type { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import type { FormControlProps as MuiFormControlProps } from "@mui/material/FormControl";
import type { InputLabelProps as MuiInputLabelProps } from "@mui/material/InputLabel";
import type { LinearProgressProps as MuiLinearProgressProps } from "@mui/material/LinearProgress";
import type { ListItemProps as MuiListItemProps } from "@mui/material/ListItem";
import type { MenuProps as MuiMenuProps } from "@mui/material/Menu";
import type { NativeSelectProps as MuiNativeSelectProps } from "@mui/material/NativeSelect";
import type { PaginationProps as MuiPaginationProps } from "@mui/material/Pagination";
import type { PopoverProps as MuiPopoverProps } from "@mui/material/Popover";
import type { SkeletonProps as MuiSkeletonProps } from "@mui/material/Skeleton";
import type { SliderProps as MuiSliderProps } from "@mui/material/Slider";
import type { TableProps as MuiTableProps } from "@mui/material/Table";
import type { TabsProps as MuiTabsProps } from "@mui/material/Tabs";
import type { ToggleButtonProps as MuiToggleButtonProps } from "@mui/material/ToggleButton";
import type { ToggleButtonGroupProps as MuiToggleButtonGroupProps } from "@mui/material/ToggleButtonGroup";
import type { TooltipProps as MuiTooltipProps } from "@mui/material/Tooltip";
import type * as React from "react";

// Global contexts & states
export type Theme =
  | "aurora-ui"
  | "claymorphism"
  | "dimensional-layering"
  | "editorial-contemporaneo"
  | "edtech-plataforma"
  | "futuristic-glassmorphism"
  | "glassmorphism"
  | "liquid-glass"
  | "neumorphism"
  | "skeuomorphism"
  | "spatial-ui";

export interface KelirContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { slug: Theme; label: string }[];
  /** Mounting/unmounting signals from KelirSwitcher (or any theme picker UI).
   *  When the counter is 0 (no switcher on the page) the provider removes the
   *  persisted theme cookie, keeping a shared origin (e.g. localhost:3000 used
   *  by several projects) free of leaked theme preferences. */
  registerSwitcher: () => void;
  unregisterSwitcher: () => void;
}

// 0. KelirProvider — the only legitimate visual entry point (P1c STYLE.md §3c).
// Valid props are ONLY: `defaultTheme` (closed Theme union) + `children`.
// Runtime theme switching is not via extra props, but via the context
// `useKelir().setTheme` / `KelirSwitcher`. Any other visual prop = violation.
export interface KelirProviderProps {
  children: React.ReactNode;
  /** Consumer-provided default theme — for this app the theme cookie already
   *  resolved on the server, so the first render matches the persisted choice
   *  and there is no flash. */
  defaultTheme: Theme;
  // Consumer brand font (font family name, e.g. "Vermin Vibes Out Of
  // Ink"). The kit applies it as --kelir-font-brand for
  // `Typography font="brand"` - consumers do not write their own CSS.
  brandFont?: string;
  // Brand identity colors (two fixed slots, not free-form values): the kit sets
  // --kelir-brand-accent/--kelir-brand-ink for `Typography
  // tone="brand-accent"|"brand-ink"` - brand text that does NOT follow the theme (e.g.
  // two words in a title). Values are sanitized of ; { } < >.
  brandColors?: { accent: string; ink: string };
}

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

// 2. Alert — sealed inline notification based on MUI (Gel.2 STYLE.md §6).
// `severity` mandatory MEANING; `title` text slot; `onClose?` = closable.
// No style/sx/className/raw-severity-MUI.
export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  severity: "error" | "warning" | "info" | "success";
  onClose?: () => void;
  id?: string;
  "aria-label"?: string;
}

// 3. Alert Dialog — sealed destructive confirmation based on MUI (Gel.2).
// BEHAVIOR (`open`/`onCancel`/`onConfirm` semantic); `title`/`description`
// text slots; button labels are strings. Escape/backdrop = cancel.
// `disableScrollLock` is kit-hardcoded. No ...rest/style/sx/className.
export interface AlertDialogProps {
  open: boolean;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  id?: string;
  "aria-label"?: string;
}

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

// 12. Calendar
// 12. Calendar - sealed date picker calendar (Gel.3c-8 STYLE.md §6).
// `value?` CONTROLLED (Date) + `onChange?(date)` event-free semantics.
// Month navigation + visuals owned by the kit. No style/sx/className.
export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
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

// 14. Carousel
// 14. Carousel - sealed carousel (Gel.3c-10 STYLE.md §6).
// `items` slide slots[]; `autoPlay?`/`interval?` rotate BEHAVIOR.
// Navigation + dots + visuals owned by the kit. No style/sx/className.
export interface CarouselProps<TItem extends React.ReactNode = React.ReactNode> {
  items: TItem[];
  autoPlay?: boolean;
  interval?: number;
}

// 15. Chart
// 15. Chart - sealed data chart (Gel.3c-11 STYLE.md §6).
// `data` free-form rows (P2 strict generic); `categories` string[];
// `dataKey` string; `type?` MEANING; `title?` TEXT slot.
// Renders bar/line/area + kit-owned visuals. No style/sx/className.
export interface ChartProps<
  TDatum extends object = Record<string, unknown>,
> {
  data: TDatum[];
  categories: string[];
  dataKey: string;
  type?: "bar" | "line" | "area";
  title?: string;
}

// 16. Checkbox — sealed binary choice based on MUI (Gel.2 STYLE.md §6).
// `onChange` semantic (boolean); `label` text slot. No ...rest/style/sx.
export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
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

// 18. Combobox
// 18. Combobox - sealed single-select based on MUI Autocomplete (Gel.3c-11 §6).
// `options` string[]; `value?/defaultValue?` CONTROLLED;
// `onChange?(value)` event-free semantics; `label?`/`placeholder?` TEXT;
// `disabled?`. multiple/freeSolo intentionally absent (request via kelir-request).
// MUI internal ref/input wiring owned by the kit. No ...rest/style/sx.
export interface ComboboxProps {
  options: string[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

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

// 21. Data Table
// 21. DataTable - sealed table + pagination based on MUI (Gel.3c-11 STYLE.md §6).
// `columns` DataTableColumn[]; `data` free-form rows (P2 strict generic);
// `paginated?`/`rowsPerPage?` BEHAVIOR; `title?` TEXT slot.
// Paging + visuals owned by the kit. No style/sx/className.
export interface DataTableColumn {
  header: string;
  accessorKey: string;
}
export interface DataTableProps {
  columns: DataTableColumn[];
  data: unknown[];
  paginated?: boolean;
  rowsPerPage?: number;
  title?: string;
}

// 22. Date Picker
// 22. DatePicker - sealed date picker (Gel.3c-8 STYLE.md §6).
// `value?` CONTROLLED (Date) + `onChange?(date?)` semantic;
// `placeholder?` TEXT. Popover + day/month/year mode owned by the kit.
export interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
}

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

// 24. Direction
// 24. Direction - sealed text direction (Gel.3c-6 STYLE.md §6).
// `dir` mandatory MEANING; `children` slot. No style/sx/className.
export interface DirectionProps {
  dir: "ltr" | "rtl";
  children: React.ReactNode;
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

// 28. Field
// 27. Field — sealed label + control + helper wrapper (Gel.3b §6).
// `label?/helperText?` TEXT slots; `error?` MEANING; `children` control.
// fullWidth is kit-hardcoded. No ...rest/style/sx/className.
export interface FieldProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  children: React.ReactNode;
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

// 30. Input — sealed text field based on MUI (P1c STYLE.md §6).
// CONTENT (`value`/`defaultValue`/`placeholder`), BEHAVIOR (`onChange`
// semantic, accepts a string, not an event; `type`; `disabled`), MEANING
// (`size`).
// No style/sx/className/raw colors/fonts — everything from kit tokens.
export interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
  disabled?: boolean;
  size?: "small" | "medium";
  id?: string;
  "aria-label"?: string;
}

// 31. InputGroup — sealed adornment group (Gel.3c-3 STYLE.md §6).
// `prefix?/suffix?` TEXT slots; `children` control. No ...rest/style.
export interface InputGroupProps {
  prefix?: string;
  suffix?: string;
  children: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 32. InputOtp — sealed one-time code (Gel.3c-3 STYLE.md §6).
// `value/onChange(string)` semantic; `length?` MEANING (default 4).
// No ...rest/style/className.
export interface InputOtpProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
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

// 34. Kbd
// 34. Kbd — sealed keyboard key (Gel.3c STYLE.md §6).
// `children` key text. No ...rest/style/sx/className.
export interface KbdProps {
  children: string;
  id?: string;
  "aria-label"?: string;
}

// 35. Label — sealed control label based on MUI (Gel.3c STYLE.md §6).
// `children` label text; `htmlFor?` association MEANING. No ...rest/style/sx.
export interface LabelProps {
  children: string;
  htmlFor?: string;
  id?: string;
  "aria-label"?: string;
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

// 40. Native Select
// 40. NativeSelect — sealed native select based on MUI (Gel.3c-3 §6).
// `options` label/value strings; `onChange` semantic (string, no event);
// `label?` text slot (sealed Typography). No ...rest/style/MUI onChange.
export interface NativeSelectOption {
  label: string;
  value: string;
}
export interface NativeSelectProps {
  options: NativeSelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
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

// 42. Pagination
// 42. Pagination — sealed pages based on MUI (Gel.3c-5 STYLE.md §6).
// `count` required; `page?/defaultPage?` FULLY CONTROLLED; `onChange` semantic
// (page number, no event). Size/colors owned by the kit. No ...rest/style/sx.
export interface PaginationProps {
  count: number;
  page?: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
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

// 44. Progress
// 44. Progress — sealed loading status based on MUI (Gel.3c-2 §6).
// `value?` 0–100; `variant?` MEANING (default determinate). No ...rest/style.
export interface ProgressProps {
  value?: number;
  variant?: "determinate" | "indeterminate";
  id?: string;
  "aria-label"?: string;
}

// 45. RadioGroup — sealed single choice based on MUI (Gel.2 §6).
// `options` label/value strings; `onChange` semantic (string).
export interface RadioGroupProps {
  options: { label: string; value: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 46. Resizable
// 46. Resizable - sealed sliding panel (Gel.3c-10 STYLE.md §6).
// `panels` slots[]; `directions?` MEANING. Drag + visuals owned by the kit.
export interface ResizableProps<TPanel extends React.ReactNode = React.ReactNode> {
  panels: TPanel[];
  directions?: "horizontal" | "vertical";
}

// 47. Scroll Area
// 47. ScrollArea - sealed scroll area (Gel.3c-7 STYLE.md §6).
// `maxHeight?` BEHAVIOR (scroll limit); `children` slot.
// Scrollbar + visuals owned by the kit. No style/sx/className.
export interface ScrollAreaProps {
  maxHeight?: string | number;
  children: React.ReactNode;
}

// 48. Select — sealed dropdown based on MUI (P1c STYLE.md §6).
// CONTENT (`options` label/value strings, `value`/`defaultValue`/`placeholder`),
// BEHAVIOR (`onChange` semantic accepting a string; `disabled`), MEANING (`label`).
// Menu/paper/scrollbar/menu width = kit-owned behavior. No style/sx/
// className/raw MenuProps/onOpen.
export interface SelectOption {
  label: string;
  value: string;
}
export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  id?: string;
  "aria-label"?: string;
}

// 49. Separator — sealed divider based on MUI (P1c STYLE.md §6).
// `label?` text; `orientation?` direction. No style/sx/className/MUI variant.
export interface SeparatorProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
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

// 52. Skeleton — sealed loading placeholder based on MUI (Gel.3a §6).
// `variant?` shape; `width?/height?` DIMENSIONS (string|number, owned by the
// consumer as layout data); `animation?` BEHAVIOR. No style/sx/className.
export interface SkeletonProps {
  variant?: "text" | "rectangular" | "circular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | false;
  id?: string;
  "aria-label"?: string;
}

// 53. Slider
// 53. Slider — sealed single-value slider based on MUI (Gel.3c-4 §6).
// SINGLE value (number, not range); `onChange` semantic (number).
// No ...rest/style/sx/MUI onChange.
export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 54. Spinner — sealed loading indicator based on MUI (P1c STYLE.md §6).
// `size?` MEANING (small/medium/large → kit-owned px). No style/sx/
// className/MUI variant/value (indeterminate owned by the kit).
export interface SpinnerProps {
  size?: "small" | "medium" | "large";
  id?: string;
  "aria-label"?: string;
}

// 55. Switch — sealed switch based on MUI (Gel.2 STYLE.md §6).
// `onChange` semantic (boolean); `label?` text slot. No ...rest/style/sx.
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 56. Table
// 56. Table - sealed data table based on MUI (Gel.3c-10 STYLE.md §6).
// `headers` TEXT[]; `rows` cell[][]. Width + visuals owned by the kit.
// `density?` = row density: "default" (14px cells) or "compact"
// (12px cells + tighter padding) for tables with many columns.
export interface TableProps<TCell extends React.ReactNode = React.ReactNode> {
  headers: string[];
  rows: TCell[][];
  density?: "default" | "compact";
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

// 58. Textarea
// 58. Textarea — sealed text area (Gel.3c-3 STYLE.md §6).
// `label?/helperText?` TEXT slots; `error?` MEANING; `onChange` semantic
// (string, no event, Input precedent); focus-ring owned by the kit.
// No ...rest/style/onFocus/onBlur/event.
export interface TextareaProps {
  label?: string;
  error?: boolean;
  helperText?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 59. Toast — sealed transient notification based on MUI (Gel.2 §6).
// `message` text slot; `actionButton?` action slot (Kelir button);
// `open`/`onClose` semantic; `autoHideDuration?` BEHAVIOR (ms, not motion
// visual — display duration, not animation duration §1.2). No ...rest/style.
export interface ToastProps {
  message: string;
  tone?: "info" | "success" | "warning" | "error";
  actionButton?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
  id?: string;
  "aria-label"?: string;
}

// Toaster (#107) - global notification queue on top of the sealed Toast.
// Not a visual component: the FIFO queue, display duration, queue limit, and
// live region are kit-owned. `useToast()` notifies from anywhere without
// per-form state. No ...rest/style/sx/className.
export interface ToasterProps {
  /** Number of notifications shown at once. Default 1 (FIFO). */
  maxVisible?: number;
  /** Logical screen position; default "bottom-end". */
  position?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
  id?: string;
}

export type ToastApi = {
  notify: (message: string, tone?: ToastProps["tone"]) => void;
  close: () => void;
};

// 60. Toggle
// 60. Toggle — sealed toggle button based on MUI (Gel.3c-2 STYLE.md §6).
// Pressed model (aria-pressed owned by the kit), not MUI selected; `children` text.
// No ...rest/style/sx/className/MUI value/selected.
export interface ToggleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 61. ToggleGroup — sealed single-choice group based on MUI (Gel.3c-2 §6).
// exclusive kit-hardcoded (always one selected); `onChange` semantic
// (string, no event); `variant?` (`separated` = separate raised buttons,
// `joined` = one tight segmented pill for small segmented control, default
// `separated`). No ...rest/style/sx/MUI exclusive/onChange.
export interface ToggleGroupOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}
export interface ToggleGroupProps {
  options: ToggleGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: "separated" | "joined";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  id?: string;
  "aria-label"?: string;
}

// 62. Tooltip
// 62. Tooltip — sealed hover info based on MUI (Gel.3c-4 STYLE.md §6).
// `title` TEXT; `children` trigger element. consumer-merge slotProps removed
// — tooltip visuals fully owned by the kit. No ...rest/style/sx/slotProps.
export interface TooltipProps {
  title: string;
  children: React.ReactElement;
  id?: string;
  "aria-label"?: string;
}

// 63. Typography — sealed text based on MUI (P1c STYLE.md §6).
// `variant` = VISUAL hierarchy (kit-owned closed union); `as`/`level` =
// DOCUMENT hierarchy (correct heading element; document hierarchy ≠ visual);
// `align` = TEXT alignment (closed union; default `left`, no visual change).
// `truncate?` = kit-owned single-line ellipsis (default `false`).
// No style/sx/className/raw colors/fonts — everything from kit tokens.
export type TypographyVariant =
  | "hero"
  | "hero-sm"
  | "display"
  | "title"
  | "h1"
  | "h2"
  | "h3"
  | "stat"
  | "body-md"
  | "body-sm"
  | "caption"
  | "label-caps"
  | "label";

export interface TypographyProps {
  children?: React.ReactNode;
  variant?: TypographyVariant;
  variantMd?: TypographyVariant;
  // Variant below 600px (token layout.mobile) - mirrors `variantMd` for
  // heading scale that shrinks on phones (e.g. hero -> hero-sm).
  variantMobile?: TypographyVariant;
  // Text color from theme tokens (primary/secondary) or brand identity
  // (brand-accent/brand-ink from KelirProvider.brandColors); none = the
  // variant's default color.
  tone?: "primary" | "secondary" | "brand-accent" | "brand-ink";
  // Identity font: text = the active theme's font (default), brand = the
  // brand font registered via KelirProvider.brandFont.
  font?: "text" | "brand";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "start" | "center" | "end" | "justify";
  truncate?: boolean;
  breakAll?: boolean;
  tracking?: "normal" | "wide";
  segments?: TypographySegment[];
  id?: string;
  "aria-label"?: string;
}

// Inline text segments with tokens for Typography (one heading element,
// not nested headings; `break` = <br/>). `tone` (muted/primary) & `scale`
// (sm = 0.55em + weight 500, md = default) from kit tokens.
export interface TypographySegment {
  text?: string;
  tone?: "muted" | "primary";
  scale?: "sm" | "md";
  break?: boolean;
}

// 64. Questionnaire
// Render split into internal modules (progress/item/nav/complete/model, P2 done).
export interface QuestionnaireOption {
  label: string;
  value: string;
}
export interface QuestionnaireQuestion {
  id: string;
  type: "single" | "multiple" | "freeform";
  title: string;
  description?: string;
  options?: QuestionnaireOption[];
  placeholder?: string;
  required?: boolean;
  skippable?: boolean;
}

export interface QuestionnaireProps {
  questions: QuestionnaireQuestion[];
  value?: Record<string, string | string[]>;
  defaultValue?: Record<string, string | string[]>;
  onChange?: (value: Record<string, string | string[]>) => void;
  onComplete?: (value: Record<string, string | string[]>) => void;
  submitLabel?: string;
  skipLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  completedLabel?: string;
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

// 74. Tile — sealed icon/logo tile (P1b STYLE.md).
// `tone?` MEANING (`primary|secondary|plain`, default `primary`): background +
// text from tokens (plain = surface + subtle border for a logo over a
// surface). No `size?` = flexible icon tile (token padding);
// `size?` MEANING (`sm|md|lg` → kit-owned 32/48/64 px) = fixed-size box
// for logos. Token radius; no shadow. No ...rest/style/sx/className.
export interface TileProps {
  children: React.ReactNode;
  tone?: "primary" | "secondary" | "plain";
  size?: "sm" | "md" | "lg";
  id?: string;
  "aria-label"?: string;
}

// 75. Banner — sealed centered status banner (P1b STYLE.md).
// `tone?` MEANING (`danger|warn|neutral`, default `neutral`): kit-owned
// bg/fg pair (Marker-note precedent: solid, not a raw color);
// child text inherits the color. Centered. No icon (that's `Alert`).
// No ...rest/style/sx/className.
export interface BannerProps {
  children: React.ReactNode;
  tone?: "danger" | "warn" | "neutral";
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

