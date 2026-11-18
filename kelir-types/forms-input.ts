import type * as React from "react";

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

// 35. Label — sealed control label based on MUI (Gel.3c STYLE.md §6).
// `children` label text; `htmlFor?` association MEANING. No ...rest/style/sx.
export interface LabelProps {
  children: string;
  htmlFor?: string;
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