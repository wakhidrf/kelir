import type { KitSize } from "./kit-size";

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

// 48. Select — sealed dropdown based on MUI (P1c STYLE.md §6).
// CONTENT (`options` label/value strings, `value`/`defaultValue`/`placeholder`),
// BEHAVIOR (`onChange` semantic accepting a string; `disabled`), MEANING (`label`).
// Menu/paper/scrollbar/menu width = kit-owned behavior. `size?` is the shared
// KitSize scale (sm/md default; xs behaves as sm, lg..3xl as md). No style/sx/
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
  size?: KitSize;
  id?: string;
  "aria-label"?: string;
}