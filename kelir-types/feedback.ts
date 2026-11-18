import type * as React from "react";

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

// 44. Progress
// 44. Progress — sealed loading status based on MUI (Gel.3c-2 §6).
// `value?` 0–100; `variant?` MEANING (default determinate). No ...rest/style.
export interface ProgressProps {
  value?: number;
  variant?: "determinate" | "indeterminate";
  id?: string;
  "aria-label"?: string;
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

// 54. Spinner — sealed loading indicator based on MUI (P1c STYLE.md §6).
// `size?` MEANING (small/medium/large → kit-owned px). No style/sx/
// className/MUI variant/value (indeterminate owned by the kit).
export interface SpinnerProps {
  size?: "small" | "medium" | "large";
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