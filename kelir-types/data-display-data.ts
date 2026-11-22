import type * as React from "react";
import type { KitAxis } from "./kit-axis";

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

// 46. Resizable
// 46. Resizable - sealed sliding panel (Gel.3c-10 STYLE.md §6).
// `panels` slots[]; `directions?` MEANING. Drag + visuals owned by the kit.
export interface ResizableProps<TPanel extends React.ReactNode = React.ReactNode> {
  panels: TPanel[];
  directions?: KitAxis;
}

// 47. Scroll Area
// 47. ScrollArea - sealed scroll area (Gel.3c-7 STYLE.md §6).
// `maxHeight?` BEHAVIOR (scroll limit); `children` slot.
// Scrollbar + visuals owned by the kit. No style/sx/className.
export interface ScrollAreaProps {
  maxHeight?: string | number;
  children: React.ReactNode;
}

// 49. Separator — sealed divider based on MUI (P1c STYLE.md §6).
// `label?` text; `orientation?` direction. No style/sx/className/MUI variant.
export interface SeparatorProps {
  label?: string;
  orientation?: KitAxis;
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