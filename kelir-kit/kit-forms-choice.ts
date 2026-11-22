import type * as React from "react";
import type { KitSize } from "./kit-size";

// 12. Calendar
// 12. Calendar - sealed date picker calendar (Gel.3c-8 STYLE.md §6).
// `value?` CONTROLLED (Date) + `onChange?(date)` event-free semantics.
// Month navigation + visuals owned by the kit. No style/sx/className.
export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
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

// 22. Date Picker
// 22. DatePicker - sealed date picker (Gel.3c-8 STYLE.md §6).
// `value?` CONTROLLED (Date) + `onChange?(date?)` semantic;
// `placeholder?` TEXT. Popover + day/month/year mode owned by the kit.
export interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
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
  size?: KitSize;
  id?: string;
  "aria-label"?: string;
}