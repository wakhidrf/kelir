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

// 0. KelirProvider — satu-satunya titik visual yang legit (P1c STYLE.md §3c).
// Props sah HANYA: `defaultTheme` (union tertutup Theme) + `children`.
// Ganti tema runtime bukan via props tambahan, melainkan via context
// `useKelir().setTheme` / `KelirSwitcher`. Props visual lain = pelanggaran.
export interface KelirProviderProps {
  children: React.ReactNode;
  /** Consumer-provided default theme — for this app the theme cookie already
   *  resolved on the server, so the first render matches the persisted choice
   *  and there is no flash. */
  defaultTheme: Theme;
}

// 1. Accordion
// 1. Accordion - ringkasan lipat sealed berbasis MUI (Gel.3c-6 STYLE.md §6).
// `summary`/`details` slot TEKS; `expanded?` TERKONTROL + `defaultExpanded?`
// + `onChange?(expanded)` semantik tanpa event; `disabled?`.
// Tanpa children/slotProps/style/sx/className/onChange-event-MUI.
export interface AccordionProps {
  summary: string;
  details: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onChange?: (expanded: boolean) => void;
  disabled?: boolean;
}

// 2. Alert — notifikasi inline sealed berbasis MUI (Gel.2 STYLE.md §6).
// `severity` MAKNA wajib; `title` slot teks; `onClose?` = closable.
// Tanpa style/sx/className/severity-MUI-mentah.
export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  severity: "error" | "warning" | "info" | "success";
  onClose?: () => void;
  id?: string;
  "aria-label"?: string;
}

// 3. Alert Dialog — konfirmasi destruktif sealed berbasis MUI (Gel.2).
// PERILAKU (`open`/`onCancel`/`onConfirm` semantik); `title`/`description`
// slot teks; label tombol string. Escape/backdrop = cancel.
// `disableScrollLock` hardcode milik kit. Tanpa ...rest/style/sx/className.
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
// 4. AspectRatio - bingkai rasio sealed (Gel.3c-6 STYLE.md §6).
// `ratio?` angka; `children` slot media (img/video/kit).
// Tanpa style/sx/className.
export interface AspectRatioProps {
  ratio?: number;
  children: React.ReactNode;
}

// 5. Attachment
// 5. Attachment - kartu berkas sealed (Gel.3c-7 STYLE.md §6).
// `name` TEKS; `size?`/`type?`/`url?` string; `status?` MAKNA;
// `progress?` angka 0-100; `onRemove?` semantik tanpa event.
// Tanpa style/sx/className.
export interface AttachmentProps {
  name: string;
  size?: string;
  type?: string;
  url?: string;
  status?: "uploading" | "success" | "error" | "idle";
  progress?: number;
  onRemove?: () => void;
}

// 6. Avatar — identitas visual sealed berbasis MUI (Gel.3a STYLE.md §6).
// `src?/alt?/fallbackText?` ISI; `size?` MAKNA (small/medium/large → px
// milik kit). Tanpa ...rest/style/sx/className/onClick MUI.
export interface AvatarProps {
  src?: string;
  alt?: string;
  fallbackText?: string;
  size?: "small" | "medium" | "large";
  id?: string;
  "aria-label"?: string;
}

// 7. Badge — label status sealed (Gel.3a STYLE.md §6).
// `variant?` MAKNA (default primary); `children` teks status.
// Tanpa ...rest/style/sx/className/onClick.
export interface BadgeProps {
  variant?: "primary" | "secondary" | "destructive" | "outline";
  children: string;
  id?: string;
  "aria-label"?: string;
}

// 8. Breadcrumb
// 8. Breadcrumb — navigasi remah sealed berbasis MUI (Gel.3c-4 §6).
// `items` label TEKS + href?/active? MAKNA. Tanpa ...rest/style/sx.
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
// 9. Bubble - gelembung chat sealed (Gel.3c-7 STYLE.md §6).
// `variant?`/`align?` MAKNA; `reactions?` string[]; `collapsible?` perilaku
// lipat internal; `children` slot isi pesan. Tanpa style/sx/className.
export interface BubbleProps {
  variant?: "sent" | "received";
  align?: "start" | "end";
  reactions?: string[];
  collapsible?: boolean;
  children: React.ReactNode;
}

// 10. Button — sealed eksplisit (P1c STYLE.md §6): tanpa warisan MUI,
// children string + slot ikon. type default "button"; "reset" disengaja
// tidak ada (minta via kelir-request).
export interface ButtonProps {
  children: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  // Perataan isi (khusus tombol full-width mis. nav): center (default,
  // ikon+teks di tengah), start (rata awal, kolom ikon lurus), atau end.
  // Nilai logis: benar di LTR maupun RTL.
  align?: "center" | "start" | "end";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  // Boleh, TAPI wajib mengawali teks terlihat (WCAG 2.5.3 Label in Name).
  // Tipe React 19 mentoleransi semua aria-* sehingga penolakan tak bisa
  // di-type-test — ditegakkan via review (§2, §11).
  "aria-label"?: string;
  "aria-describedby"?: string;
  id?: string;
}

// 10b. IconButton — tombol ikon-only (P1c STYLE.md §6): icon + aria-label
// wajib (WCAG 2.5.3 ditegakkan oleh bentuk komponen).
export interface IconButtonProps {
  icon: React.ReactNode;
  "aria-label": string;
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  // Bentuk bingkai: rounded (default, ikut token peran), circle, square.
  shape?: "rounded" | "circle" | "square";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-describedby"?: string;
  id?: string;
}

// 11. Button Group
// 11. ButtonGroup — grup tombol sealed berbasis MUI (Gel.3b STYLE.md §6).
// `children` tombol Kelir; `disabled?` PERILAKU. Tanpa ...rest/style/sx.
export interface ButtonGroupProps {
  children: React.ReactNode;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 12. Calendar
// 12. Calendar - kalender pilih tanggal sealed (Gel.3c-8 STYLE.md §6).
// `value?` TERKONTROL (Date) + `onChange?(date)` semantik tanpa event.
// Navigasi bulan + visual milik kit. Tanpa style/sx/className.
export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

// 13. Card — kartu sealed berbasis MUI (P1c STYLE.md §6).
// Slot teks (`title`/`subtitle`) = string; slot aksi/isi
// (`headerActions`/`footer`/`children`) = ReactNode (tombol/komponen Kelir).
// `headerAlign` = perataan judul + subjudul header (default `start`).
// `scrollable?` = isi scroll internal, header/footer tetap (kartu jadi kolom
// flex; default false; tinggi luar milik konsumen).
// Tanpa style/sx/className/warna/font mentah — semua dari token kit.
export interface CardProps {
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  headerAlign?: "start" | "center" | "end";
  scrollable?: boolean;
  flag?: "danger" | "warn";
  footer?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 14. Carousel
// 14. Carousel - korsel sealed (Gel.3c-10 STYLE.md §6).
// `items` slot slide[]; `autoPlay?`/`interval?` PERILAKU putar.
// Navigasi + dot + visual milik kit. Tanpa style/sx/className.
export interface CarouselProps<TItem extends React.ReactNode = React.ReactNode> {
  items: TItem[];
  autoPlay?: boolean;
  interval?: number;
}

// 15. Chart
// 15. Chart - grafik data sealed (Gel.3c-11 STYLE.md §6).
// `data` baris-bebas (P2 generik ketat); `categories` string[];
// `dataKey` string; `type?` MAKNA; `title?` slot TEKS.
// Render bar/line/area + visual milik kit. Tanpa style/sx/className.
export interface ChartProps<
  TDatum extends object = Record<string, unknown>,
> {
  data: TDatum[];
  categories: string[];
  dataKey: string;
  type?: "bar" | "line" | "area";
  title?: string;
}

// 16. Checkbox — pilihan biner sealed berbasis MUI (Gel.2 STYLE.md §6).
// `onChange` semantik (boolean); `label` slot teks. Tanpa ...rest/style/sx.
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
// 17. Collapsible - lipatan sealed berbasis MUI Collapse (Gel.3c-6 STYLE.md §6).
// `trigger` slot TEKS (kit yang me-render + menangani klik);
// `open?` TERKONTROL + `defaultOpen?` + `onOpenChange?(open)` semantik.
// Tanpa cloneElement/onClick-konsumen/style/sx/className.
export interface CollapsibleProps {
  trigger: string;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// 18. Combobox
// 18. Combobox - pilih-satu sealed berbasis MUI Autocomplete (Gel.3c-11 §6).
// `options` string[]; `value?/defaultValue?` TERKONTROL;
// `onChange?(value)` semantik tanpa event; `label?`/`placeholder?` TEKS;
// `disabled?`. multiple/freeSolo disengaja tidak ada (minta via kelir-request).
// Wiring ref/input MUI internal milik kit. Tanpa ...rest/style/sx.
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
// 19. Command - palet perintah sealed (Gel.3c-8 STYLE.md §6).
// `placeholder?` TEKS; `groups` CommandGroup[] (filter + visual milik kit;
// `onSelect?` tiap item semantik tanpa event). Tanpa style/sx/className.
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
// 20. ContextMenu - menu klik-kanan sealed berbasis MUI (Gel.3c-8 STYLE.md §6).
// `trigger` slot TEKS (kit render area klik-kanan + tangani event, tanpa
// cloneElement); `menuItems` ContextMenuItem[] (`onClick?` semantik).
// Posisi + visual milik kit. Tanpa style/sx/className/slotProps.
export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}
export interface ContextMenuProps {
  trigger: string;
  menuItems: ContextMenuItem[];
}

// 21. Data Table
// 21. DataTable - tabel + paginasi sealed berbasis MUI (Gel.3c-11 STYLE.md §6).
// `columns` DataTableColumn[]; `data` baris-bebas (P2 generik ketat);
// `paginated?`/`rowsPerPage?` PERILAKU; `title?` slot TEKS.
// Halaman + visual milik kit. Tanpa style/sx/className.
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
// 22. DatePicker - pemilih tanggal sealed (Gel.3c-8 STYLE.md §6).
// `value?` TERKONTROL (Date) + `onChange?(date?)` semantik;
// `placeholder?` TEKS. Popover + mode hari/bulan/tahun milik kit.
export interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
}

// 23. Dialog — dialog sealed berbasis MUI (P1c STYLE.md §6).
// PERILAKU (`open`/`onClose` semantik tanpa event) milik konsumen;
// `title` slot teks (string); `children`/`actions` slot isi/aksi.
// `disableScrollLock` keputusan kit (hardcode). Tanpa style/sx/className.
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
// 24. Direction - arah teks sealed (Gel.3c-6 STYLE.md §6).
// `dir` MAKNA wajib; `children` slot. Tanpa style/sx/className.
export interface DirectionProps {
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}

// 25. Drawer
// 25. Drawer — laci samping sealed berbasis MUI (Gel.3c-5 STYLE.md §6).
// `open` TERKONTROL PENUH (wajib); `onClose` semantik tanpa event/reason
// (preseden Dialog); `title?` slot TEKS; anchor default kiri milik kit.
// Tanpa ...rest/style/sx/slotProps MUI.
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  // Tinggi: full (default, drawer setinggi layar) atau auto
  // (bungkus isi + tengah vertikal - mis. nav ringkas 3 tombol).
  height?: "full" | "auto";
  id?: string;
  "aria-label"?: string;
}

// 26. Dropdown Menu
// 26. DropdownMenu - menu klik sealed berbasis MUI (Gel.3c-9 STYLE.md §6).
// `trigger` slot TEKS (kit render tombol pemicu + tangani klik, tanpa
// cloneElement, preseden Collapsible/ContextMenu); `items`
// DropdownMenuItem[] (`onClick?` semantik). Posisi + visual milik kit.
export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
}
export interface DropdownMenuProps {
  trigger: string;
  items: DropdownMenuItem[];
}

// 27. Empty
// 27. Empty — status kosong sealed (Gel.3c STYLE.md §6).
// `title?/description?` slot TEKS; `action?/icon?` slot ReactNode.
// Tanpa ...rest/style/sx/className/onClick.
export interface EmptyProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 28. Field
// 27. Field — pembungkus label + kontrol + helper sealed (Gel.3b §6).
// `label?/helperText?` slot TEKS; `error?` MAKNA; `children` kontrol.
// fullWidth hardcode milik kit. Tanpa ...rest/style/sx/className.
export interface FieldProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  children: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 29. Hover Card
// 29. HoverCard - kartu hover sealed berbasis MUI Popper (Gel.3c-7 STYLE.md §6).
// `trigger` slot jangkar ELEMEN (butuh node untuk posisi, preseden Tooltip); `children` slot isi.
// Placement + timer + visual milik kit. Tanpa style/sx/className.
export interface HoverCardProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
}

// 30. Input — field teks sealed berbasis MUI (P1c STYLE.md §6).
// ISI (`value`/`defaultValue`/`placeholder`), PERILAKU (`onChange` semantik
// menerima string, bukan event; `type`; `disabled`), MAKNA (`size`).
// Tanpa style/sx/className/warna/font mentah — semua dari token kit.
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

// 31. Input Group
// 31. InputGroup — grup adornment sealed (Gel.3c-3 STYLE.md §6).
// `prefix?/suffix?` slot TEKS; `children` kontrol. Tanpa ...rest/style.
export interface InputGroupProps {
  prefix?: string;
  suffix?: string;
  children: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 32. InputOtp — kode sekali-pakai sealed (Gel.3c-3 STYLE.md §6).
// `value/onChange(string)` semantik; `length?` MAKNA (default 4).
// Tanpa ...rest/style/className.
export interface InputOtpProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  id?: string;
  "aria-label"?: string;
}

// 33. Item
// 33. Item — baris daftar sealed berbasis MUI (Gel.3c-5 STYLE.md §6).
// `title/description?` slot TEKS; `media?/action?` slot komponen sealed.
// Tanpa ...rest/style/sx/slotProps MUI.
export interface ItemProps {
  title: string;
  description?: string;
  media?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 34. Kbd
// 34. Kbd — tombol keyboard sealed (Gel.3c STYLE.md §6).
// `children` teks tombol. Tanpa ...rest/style/sx/className.
export interface KbdProps {
  children: string;
  id?: string;
  "aria-label"?: string;
}

// 35. Label — label kontrol sealed berbasis MUI (Gel.3c STYLE.md §6).
// `children` teks label; `htmlFor?` asosiasi MAKNA. Tanpa ...rest/style/sx.
export interface LabelProps {
  children: string;
  htmlFor?: string;
  id?: string;
  "aria-label"?: string;
}

// 36. Marker — penanda semantik sealed berbasis MUI (P1c STYLE.md §6).
// `variant` bentuk (status/note/border/separator); `intent` MAKNA
// (primary/secondary/error/success/warning) — bukan `color` mentah.
// Tanpa style/className/event HTML — semua visual dari token kit.
export interface MarkerProps {
  variant?: "status" | "note" | "border" | "separator";
  intent?: "primary" | "secondary" | "error" | "success" | "warning";
  children: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 37. Menubar
// 37. Menubar - bilah menu sealed berbasis MUI (Gel.3c-9 STYLE.md §6).
// `menus` MenubarMenu[] (trigger TEKS + items; `onClick?` semantik).
// Menu terbuka + visual milik kit. Tanpa style/sx/className.
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
// 38. Message — gelembung chat sealed (Gel.3b STYLE.md §6).
// `sender/time?/text` slot TEKS; `avatar?` slot media; `align?` MAKNA.
// Tanpa ...rest/style/sx/className/onClick.
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
// 39. MessageScroller - gulir pesan sealed (Gel.3c-9 STYLE.md §6).
// `children` slot pesan; `onLoadMore?`/`hasMore?` PERILAKU muat-atas;
// `maxHeight?` PERILAKU (default milik kit). Scrollbar milik kit.
export interface MessageScrollerProps {
  children: React.ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  maxHeight?: string | number;
}

// 40. Native Select
// 40. NativeSelect — select native sealed berbasis MUI (Gel.3c-3 §6).
// `options` label/value string; `onChange` semantik (string, tanpa event);
// `label?` slot teks (Typography sealed). Tanpa ...rest/style/onChange MUI.
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
// 41. NavigationMenu - menu navigasi sealed (Gel.3c-9 STYLE.md §6).
// `items` NavigationMenuItem[] (label TEKS; href?/onClick? semantik tanpa
// event — adaptor zero-arg di sisi kit; active? MAKNA). Visual milik kit.
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
// 42. Pagination — halaman sealed berbasis MUI (Gel.3c-5 STYLE.md §6).
// `count` wajib; `page?/defaultPage?` TERKONTROL PENUH; `onChange` semantik
// (page number, tanpa event). Ukuran/warna milik kit. Tanpa ...rest/style/sx.
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
// 43. Popover — lapisan konteks sealed berbasis MUI (Gel.3c-4 §6).
// `trigger` slot pemicu; `open?` TERKONTROL PENUH vs internal (tak-beri-open
// = kelola sendiri); `onClose` semantik tanpa event/reason (preseden Dialog).
// anchorEl/posisi milik kit (trigger). Tanpa ...rest/style/sx/slotProps MUI.
export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  id?: string;
  "aria-label"?: string;
}

// 44. Progress
// 44. Progress — status loading sealed berbasis MUI (Gel.3c-2 §6).
// `value?` 0–100; `variant?` MAKNA (default determinate). Tanpa ...rest/style.
export interface ProgressProps {
  value?: number;
  variant?: "determinate" | "indeterminate";
  id?: string;
  "aria-label"?: string;
}

// 45. RadioGroup — pilihan tunggal sealed berbasis MUI (Gel.2 §6).
// `options` label/value string; `onChange` semantik (string).
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
// 46. Resizable - panel geser sealed (Gel.3c-10 STYLE.md §6).
// `panels` slot[]; `directions?` MAKNA. Drag + visual milik kit.
export interface ResizableProps<TPanel extends React.ReactNode = React.ReactNode> {
  panels: TPanel[];
  directions?: "horizontal" | "vertical";
}

// 47. Scroll Area
// 47. ScrollArea - area gulir sealed (Gel.3c-7 STYLE.md §6).
// `maxHeight?` PERILAKU (batas gulir); `children` slot.
// Scrollbar + visual milik kit. Tanpa style/sx/className.
export interface ScrollAreaProps {
  maxHeight?: string | number;
  children: React.ReactNode;
}

// 48. Select — dropdown sealed berbasis MUI (P1c STYLE.md §6).
// ISI (`options` label/value string, `value`/`defaultValue`/`placeholder`),
// PERILAKU (`onChange` semantik menerima string; `disabled`), MAKNA (`label`).
// Menu/paper/scrollbar/lebar menu = perilaku milik kit. Tanpa style/sx/
// className/MenuProps/onOpen mentah.
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

// 49. Separator — pemisah sealed berbasis MUI (P1c STYLE.md §6).
// `label?` teks; `orientation?` arah. Tanpa style/sx/className/variant MUI.
export interface SeparatorProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
  id?: string;
  "aria-label"?: string;
}

// 50. Sheet
// 50. Sheet — lembar bawah sealed berbasis MUI (Gel.3c-5 STYLE.md §6).
// Seperti Drawer + anchor bottom hardcode milik kit (bukan warisan Drawer —
// warisan transitif dilarang agar kontrak tiap komponen terbaca mandiri).
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 51. Sidebar
// 51. Sidebar — navigasi samping sealed (Gel.3c STYLE.md §6; responsif ISSUE-005).
// `header?/footer?/children` slot; `mode` putuskan docked-vs-overlay
// (auto = docked ≥ md 900px, overlay di bawahnya); `open` hanya overlay
// (terkontrol + tak-terkontrol via defaultOpen); `triggerVariant` pemicu tepi
// milik kit khusus overlay (none/hamburger/chevron) — union gaya tombol,
// bukan slot (slot-trigger komponen lain tak terkait); `overlayHeight`
// full/auto khusus overlay (`none` = tombol sendiri, pakai elemen native);
// lebar/tinggi milik kit. Tanpa ...rest/style.
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
  // Wajib: landmark nav butuh nama (tombol buka/tutup menurunkannya).
  "aria-label": string;
}

// 52. Skeleton — placeholder loading sealed berbasis MUI (Gel.3a §6).
// `variant?` bentuk; `width?/height?` DIMENSI (string|number, milik konsumen
// sebagai data layout); `animation?` PERILAKU. Tanpa style/sx/className.
export interface SkeletonProps {
  variant?: "text" | "rectangular" | "circular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | false;
  id?: string;
  "aria-label"?: string;
}

// 53. Slider
// 53. Slider — geser nilai tunggal sealed berbasis MUI (Gel.3c-4 §6).
// Nilai TUNGGAL (number, bukan range); `onChange` semantik (number).
// Tanpa ...rest/style/sx/onChange MUI.
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

// 54. Spinner — indikator loading sealed berbasis MUI (P1c STYLE.md §6).
// `size?` MAKNA (small/medium/large → px milik kit). Tanpa style/sx/
// className/variant/value MUI (indeterminate milik kit).
export interface SpinnerProps {
  size?: "small" | "medium" | "large";
  id?: string;
  "aria-label"?: string;
}

// 55. Switch — sakelar sealed berbasis MUI (Gel.2 STYLE.md §6).
// `onChange` semantik (boolean); `label?` slot teks. Tanpa ...rest/style/sx.
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
// 56. Table - tabel data sealed berbasis MUI (Gel.3c-10 STYLE.md §6).
// `headers` TEKS[]; `rows` sel[][]. Lebar + visual milik kit.
export interface TableProps<TCell extends React.ReactNode = React.ReactNode> {
  headers: string[];
  rows: TCell[][];
}

// 57. Tabs
// 57. Tabs — tab terkontrol/tak-terkontrol sealed berbasis MUI (Gel.3c-2 §6).
// `items` label/value string + content; `value?/defaultValue?/onChange?(string)`
// semantik (tanpa event). Tanpa ...rest/style/sx/className.
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
// 58. Textarea — area teks sealed (Gel.3c-3 STYLE.md §6).
// `label?/helperText?` slot TEKS; `error?` MAKNA; `onChange` semantik
// (string, tanpa event, preseden Input); focus-ring milik kit.
// Tanpa ...rest/style/onFocus/onBlur/event.
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

// 59. Toast — notifikasi sementara sealed berbasis MUI (Gel.2 §6).
// `message` slot teks; `actionButton?` slot aksi (tombol Kelir);
// `open`/`onClose` semantik; `autoHideDuration?` PERILAKU (ms, bukan motion
// visual — durasi tampil, bukan durasi animasi §1.2). Tanpa ...rest/style.
export interface ToastProps {
  message: string;
  actionButton?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
  id?: string;
  "aria-label"?: string;
}

// 60. Toggle
// 60. Toggle — tombol tekan sealed berbasis MUI (Gel.3c-2 STYLE.md §6).
// Model pressed (aria-pressed milik kit), bukan selected MUI; `children` teks.
// Tanpa ...rest/style/sx/className/value/selected MUI.
export interface ToggleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 61. ToggleGroup — grup pilihan tunggal sealed berbasis MUI (Gel.3c-2 §6).
// exclusive hardcode milik kit (selalu satu terpilih); `onChange` semantik
// (string, tanpa event). Tanpa ...rest/style/sx/exclusive/onChange MUI.
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
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 62. Tooltip
// 62. Tooltip — info hover sealed berbasis MUI (Gel.3c-4 STYLE.md §6).
// `title` TEKS; `children` elemen pemicu. slotProps konsumen-merge dihapus —
// visual tooltip milik kit penuh. Tanpa ...rest/style/sx/slotProps.
export interface TooltipProps {
  title: string;
  children: React.ReactElement;
  id?: string;
  "aria-label"?: string;
}

// 63. Typography — teks sealed berbasis MUI (P1c STYLE.md §6).
// `variant` = hierarki VISUAL (union tertutup milik kit); `as`/`level` =
// hierarki DOKUMEN (elemen heading yang benar; hierarki dokumen ≠ visual);
// `align` = perataan TEKS (union tertutup; default `left`, nol-ubah visual).
// `truncate?` = elipsis satu-baris milik kit (default `false`).
// Tanpa style/sx/className/warna/font mentah — semua dari token kit.
export interface TypographyProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "body-md" | "body-sm" | "caption" | "label-caps";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "start" | "center" | "end" | "justify";
  truncate?: boolean;
  breakAll?: boolean;
  tracking?: "normal" | "wide";
  id?: string;
  "aria-label"?: string;
}

// 64. Questionnaire
// Render dipecah modul internal (progress/item/nav/complete/model, P2 selesai).
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

// 65. Stack — primitif layout vertikal/horizontal (P1b STYLE.md).
// Gap union tertutup dari token css.layout.space; `align`/`justify` union
// tertutup perataan flex (nilai logis, RTL-benar); `wrap?` → flex-wrap
// (default `false`); default = perilaku lama (nol-ubah visual).
// Tanpa warna/border/shadow.
export interface StackProps {
  children: React.ReactNode;
  gap?: "xs" | "sm" | "md" | "lg";
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
  wrap?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 66. Grid — primitif layout kolom (P1b STYLE.md).
// Columns union tertutup (bukan angka bebas); gap dari css.layout.space.
export interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "xs" | "sm" | "md" | "lg";
  id?: string;
  "aria-label"?: string;
}

// 67. Spacer — jarak vertikal semantik (P1b STYLE.md).
// Size union tertutup dari token css.layout.space.
export interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg";
  id?: string;
}

// 68. Container — penampung lebar halaman (P1b STYLE.md).
// `maxWidth?` MAKNA (sm/md/lg/xl → px milik kit, default xl = token
// container); `padding?` gutter halaman dari token css.layout.space
// (default xl = token sidePadding). `paddingBlock?` napas vertikal dari
// skala space yang sama (`none` = 0, default `none`); `clip?` memotong
// isi meluap (`overflow: hidden`, default `false`). Murni layout: tanpa
// warna/border/shadow/font. Tanpa ...rest/style/sx/className.
export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  padding?: "sm" | "md" | "lg" | "xl" | "2xl";
  paddingBlock?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  clip?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 69. Image — media netral sealed (P1b STYLE.md).
// `src` wajib; `alt?` selalu dirender sebagai atribut (string kosong bila
// tak diisi → lolos axe image-alt). `height?` MAKNA (xs/sm/md/lg/xl → px
// milik kit, default md); lebar mengikuti rasio asli. `fit?`
// (contain/cover, default contain); `radius?` dari token radius kit
// (default none — netral seperti Stack, tanpa shadow/border).
// Tanpa ...rest/style/sx/className.
export interface ImageProps {
  src: string;
  alt?: string;
  height?: "xs" | "sm" | "md" | "lg" | "xl";
  fit?: "contain" | "cover";
  radius?: "none" | "sm" | "md" | "lg";
  id?: string;
  "aria-label"?: string;
}

// 70. FlexItem — kontrol item flex sealed (P1b STYLE.md).
// Nama `Item` sudah dipakai baris daftar (title/description/media/action),
// jadi primitif ini bernama `FlexItem`. `grow?` → `flex: 1, minWidth: 0`
// (default `false`); `shrink?` = `false` → `flexShrink: 0` (default `true`);
// `clip?` → `overflow: hidden` (default `false`, properti dihilangkan penuh
// saat mati — preseden `Stack wrap?`; pasangan alami `grow clip` = pola
// truncasi baris flex). Boolean tertutup, tanpa angka bebas. Default = blok
// biasa (tanpa prop flex). Tanpa ...rest/style/sx/className.
export interface FlexItemProps {
  children: React.ReactNode;
  grow?: boolean;
  shrink?: boolean;
  clip?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 71. Shell — cangkang viewport app-shell admin (P1b STYLE.md).
// `height: 100dvh, overflow: hidden`, arah baris (sidebar + konten
// berdampingan) atau `stacked?` (kolom: TopBar + konten bertumpuk,
// default `false`). Murni layout: tanpa warna/border/shadow.
// Tanpa ...rest/style/sx/className.
export interface ShellProps {
  children: React.ReactNode;
  stacked?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 72. Content — satu-satunya area scroll app-shell (P1b STYLE.md).
// `flex: 1` + scroll vertikal internal + padding responsif dari token
// (desktop lega, mobile rapat; `compact?` memaksa rapat, default
// `false`) + latar background. SSR-aman: server + render pertama =
// desktop, koreksi setelah mount (pola Sidebar, tanpa mismatch).
// Tanpa ...rest/style/sx/className.
export interface ContentProps {
  children: React.ReactNode;
  compact?: boolean;
  id?: string;
  "aria-label"?: string;
}

// 73. TopBar — bar mobile app-shell (P1b STYLE.md).
// Slot `left?`/`right?` (node; teks di dalamnya string) disejajarkan
// ujung-ke-ujung; latar surface. Tanpa warna/border/shadow kustom.
// Tanpa ...rest/style/sx/className.
export interface TopBarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

// 74. Tile — ubin ikon/logo sealed (P1b STYLE.md).
// `tone?` MAKNA (`primary|secondary|plain`, default `primary`): latar +
// teks dari token (plain = surface + border terang untuk logo di atas
// surface). Tanpa `size?` = ubin-ikon fleksibel (padding token);
// `size?` MAKNA (`sm|md|lg` → 32/48/64 px milik kit) = kotak ukuran-tetap
// untuk logo. Radius token; tanpa shadow. Tanpa ...rest/style/sx/className.
export interface TileProps {
  children: React.ReactNode;
  tone?: "primary" | "secondary" | "plain";
  size?: "sm" | "md" | "lg";
  id?: string;
  "aria-label"?: string;
}

// 75. Banner — spanduk status tengah sealed (P1b STYLE.md).
// `tone?` MAKNA (`danger|warn|neutral`, default `neutral`): pasangan
// bg/fg milik kit (preseden Marker-note: solid, bukan warna mentah);
// teks anak mewarisi warna. Rata tengah. Tanpa ikon (itu `Alert`).
// Tanpa ...rest/style/sx/className.
export interface BannerProps {
  children: React.ReactNode;
  tone?: "danger" | "warn" | "neutral";
  id?: string;
  "aria-label"?: string;
}

// 76. Link — tautan sebaris sealed (P1b STYLE.md).
// `href` wajib (tanpanya pakai `Button variant="ghost"`); teks + ikon
// segaris milik kit (`external?` → ikon buka-baru + `target _blank` +
// `rel noopener`, default `false` → ikon panah). Warna textPrimary,
// tanpa underline. Tanpa ...rest/style/sx/className.
export interface LinkProps {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  id?: string;
  "aria-label"?: string;
}
