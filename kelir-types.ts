import type { AccordionProps as MuiAccordionProps } from "@mui/material/Accordion";
import type { AlertProps as MuiAlertProps } from "@mui/material/Alert";
import type { AutocompleteProps as MuiAutocompleteProps } from "@mui/material/Autocomplete";
import type { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import type { BadgeProps as MuiBadgeProps } from "@mui/material/Badge";
import type { BreadcrumbsProps as MuiBreadcrumbsProps } from "@mui/material/Breadcrumbs";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import type { ButtonGroupProps as MuiButtonGroupProps } from "@mui/material/ButtonGroup";
import type { CardProps as MuiCardProps } from "@mui/material/Card";
import type { CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import type { CircularProgressProps as MuiCircularProgressProps } from "@mui/material/CircularProgress";
import type { DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import type { DividerProps as MuiDividerProps } from "@mui/material/Divider";
import type { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import type { FormControlProps as MuiFormControlProps } from "@mui/material/FormControl";
import type { InputBaseProps as MuiInputBaseProps } from "@mui/material/InputBase";
import type { InputLabelProps as MuiInputLabelProps } from "@mui/material/InputLabel";
import type { LinearProgressProps as MuiLinearProgressProps } from "@mui/material/LinearProgress";
import type { ListItemProps as MuiListItemProps } from "@mui/material/ListItem";
import type { MenuProps as MuiMenuProps } from "@mui/material/Menu";
import type { NativeSelectProps as MuiNativeSelectProps } from "@mui/material/NativeSelect";
import type { PaginationProps as MuiPaginationProps } from "@mui/material/Pagination";
import type { PopoverProps as MuiPopoverProps } from "@mui/material/Popover";
import type { RadioGroupProps as MuiRadioGroupProps } from "@mui/material/RadioGroup";
import type { SelectProps as MuiSelectProps } from "@mui/material/Select";
import type { SkeletonProps as MuiSkeletonProps } from "@mui/material/Skeleton";
import type { SliderProps as MuiSliderProps } from "@mui/material/Slider";
import type { SnackbarProps as MuiSnackbarProps } from "@mui/material/Snackbar";
import type { SwitchProps as MuiSwitchProps } from "@mui/material/Switch";
import type { TableProps as MuiTableProps } from "@mui/material/Table";
import type { TabsProps as MuiTabsProps } from "@mui/material/Tabs";
import type { ToggleButtonProps as MuiToggleButtonProps } from "@mui/material/ToggleButton";
import type { ToggleButtonGroupProps as MuiToggleButtonGroupProps } from "@mui/material/ToggleButtonGroup";
import type { TooltipProps as MuiTooltipProps } from "@mui/material/Tooltip";
import type { TypographyProps as MuiTypographyProps } from "@mui/material/Typography";
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

// 1. Accordion
export interface AccordionProps extends Omit<MuiAccordionProps, "children"> {
  summary: React.ReactNode;
  details: React.ReactNode;
}

// 2. Alert
export interface AlertProps extends Omit<MuiAlertProps, "title"> {
  title?: React.ReactNode;
}

// 3. Alert Dialog
export interface AlertDialogProps
  extends Omit<MuiDialogProps, "open" | "title"> {
  open: boolean;
  title: React.ReactNode;
  description: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

// 4. Aspect Ratio
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
  children: React.ReactNode;
}

// 5. Attachment
export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: string;
  type?: string;
  url?: string;
  status?: "uploading" | "success" | "error" | "idle";
  progress?: number;
  onRemove?: () => void;
}

// 6. Avatar
export interface AvatarProps extends MuiAvatarProps {
  fallbackText?: string;
}

// 7. Badge
export interface BadgeProps
  extends Omit<MuiBadgeProps, "children" | "variant"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "destructive" | "outline";
}

// 8. Breadcrumb
export interface BreadcrumbProps extends MuiBreadcrumbsProps {
  items: { label: React.ReactNode; href?: string; active?: boolean }[];
}

// 9. Bubble
export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  align?: "left" | "right";
  reactions?: string[];
  collapsible?: boolean;
  children: React.ReactNode;
}

// 10. Button
export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
}

// 11. Button Group
export interface ButtonGroupProps extends MuiButtonGroupProps {
  children: React.ReactNode;
}

// 12. Calendar
export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Date;
  onChange?: (date: Date) => void;
}

// 13. Card
export interface CardProps extends Omit<MuiCardProps, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
}

// 14. Carousel
export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

// 15. Chart
export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: unknown[];
  categories: string[];
  dataKey: string;
  type?: "bar" | "line" | "area";
}

// 16. Checkbox
export interface CheckboxProps extends MuiCheckboxProps {
  label?: React.ReactNode;
}

// 17. Collapsible
export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// 18. Combobox
export interface ComboboxProps
  extends Omit<
    MuiAutocompleteProps<string, boolean, boolean, boolean>,
    "renderInput"
  > {
  label?: string;
  placeholder?: string;
}

// 19. Command
export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  groups: {
    heading: string;
    items: {
      label: string;
      value: string;
      icon?: React.ReactNode;
      onSelect?: () => void;
    }[];
  }[];
}

// 20. Context Menu
export interface ContextMenuProps extends Omit<MuiMenuProps, "open"> {
  trigger: React.ReactNode;
  menuItems: { label: string; icon?: React.ReactNode; onClick?: () => void }[];
}

// 21. Data Table
export interface DataTableProps extends Omit<MuiTableProps, "children"> {
  columns: { header: string; accessorKey: string }[];
  data: unknown[];
  paginated?: boolean;
  rowsPerPage?: number;
}

// 22. Date Picker
export interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
}

// 23. Dialog
export interface DialogProps extends Omit<MuiDialogProps, "title"> {
  title?: React.ReactNode;
  actions?: React.ReactNode;
}

// 24. Direction
export interface DirectionProps extends React.HTMLAttributes<HTMLDivElement> {
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}

// 25. Drawer
export interface DrawerProps extends Omit<MuiDrawerProps, "title"> {
  title?: React.ReactNode;
}

// 26. Dropdown Menu
export interface DropdownMenuProps
  extends Omit<MuiMenuProps, "open" | "anchorEl"> {
  trigger: React.ReactNode;
  items: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    divider?: boolean;
  }[];
}

// 27. Empty
export interface EmptyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

// 28. Field
export interface FieldProps extends MuiFormControlProps {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
  children: React.ReactNode;
}

// 29. Hover Card
export interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

// 30. Input
export interface InputProps extends Omit<MuiInputBaseProps, "size"> {
  size?: "small" | "medium";
}

// 31. Input Group
export interface InputGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}

// 32. Input Otp
export interface InputOtpProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

// 33. Item
export interface ItemProps extends Omit<MuiListItemProps, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  media?: React.ReactNode;
  action?: React.ReactNode;
}

// 34. Kbd
export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

// 35. Label
export interface LabelProps extends MuiInputLabelProps {
  children: React.ReactNode;
}

// 36. Marker
export interface MarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "status" | "note" | "border" | "separator";
  color?: "primary" | "secondary" | "error" | "success" | "warning";
  children: React.ReactNode;
}

// 37. Menubar
export interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {
  menus: {
    trigger: string;
    items: { label: string; onClick?: () => void }[];
  }[];
}

// 38. Message
export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: React.ReactNode;
  sender: string;
  time?: string;
  text: string;
  align?: "left" | "right";
}

// 39. Message Scroller
export interface MessageScrollerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// 40. Native Select
export interface NativeSelectProps extends MuiNativeSelectProps {
  options: { label: string; value: string }[];
}

// 41. Navigation Menu
export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  }[];
}

// 42. Pagination
export interface PaginationProps extends MuiPaginationProps {}

// 43. Popover
export interface PopoverProps extends Omit<MuiPopoverProps, "open"> {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
}

// 44. Progress
export interface ProgressProps extends MuiLinearProgressProps {}

// 45. Radio Group
export interface RadioGroupProps extends MuiRadioGroupProps {
  options: { label: string; value: string }[];
}

// 46. Resizable
export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  panels: React.ReactNode[];
  directions?: "horizontal" | "vertical";
}

// 47. Scroll Area
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
  children: React.ReactNode;
}

// 48. Select
export interface SelectProps extends Omit<MuiSelectProps, "children"> {
  options: { label: string; value: string }[];
}

// 49. Separator
export interface SeparatorProps extends MuiDividerProps {
  label?: string;
}

// 50. Sheet
export interface SheetProps extends DrawerProps {}

// 51. Sidebar
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

// 52. Skeleton
export interface SkeletonProps extends MuiSkeletonProps {}

// 53. Slider
export interface SliderProps extends MuiSliderProps {}

// 54. Spinner
export interface SpinnerProps extends MuiCircularProgressProps {}

// 55. Switch
export interface SwitchProps extends MuiSwitchProps {
  label?: React.ReactNode;
}

// 56. Table
export interface TableProps extends MuiTableProps {
  headers: string[];
  rows: React.ReactNode[][];
}

// 57. Tabs
export interface TabsProps extends Omit<MuiTabsProps, "children"> {
  items: { label: string; content: React.ReactNode; value: string }[];
  defaultValue?: string;
}

// 58. Textarea
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
}

// 59. Toast
export interface ToastProps extends MuiSnackbarProps {
  message: string;
  actionButton?: React.ReactNode;
}

// 60. Toggle
export interface ToggleProps extends MuiToggleButtonProps {}

// 61. Toggle Group
export interface ToggleGroupProps
  extends Omit<MuiToggleButtonGroupProps, "children"> {
  options: { label: string; value: string; icon?: React.ReactNode }[];
}

// 62. Tooltip
export interface TooltipProps extends Omit<MuiTooltipProps, "children"> {
  children: React.ReactElement;
}

// 63. Typography
export interface TypographyProps extends Omit<MuiTypographyProps, "variant"> {
  variant?: "h1" | "h2" | "body-md" | "label-caps";
}
