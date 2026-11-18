import type { ToastProps } from "../kelir-types";

type StoredToast = {
  id: number;
  message: string;
  tone?: ToastProps["tone"];
};

export const TOAST_QUEUE_LIMIT = 20;

const EMPTY_QUEUE: readonly StoredToast[] = [];
const listeners = new Set<() => void>();

let queue: readonly StoredToast[] = [];
let nextId = 0;

function emit() {
  for (const listener of listeners) listener();
}

export function notify(message: string, tone?: ToastProps["tone"]) {
  const room = queue.length >= TOAST_QUEUE_LIMIT ? queue.slice(1) : queue;
  queue = [...room, { id: ++nextId, message, tone }];
  emit();
}

export function close() {
  if (queue.length === 0) return;
  queue = queue.slice(1);
  emit();
}

export function dismiss(id: number) {
  const next = queue.filter((item) => item.id !== id);
  if (next.length === queue.length) return;
  queue = next;
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) queue = EMPTY_QUEUE;
  };
}

export function getSnapshot() {
  return queue;
}

export function getServerSnapshot() {
  return EMPTY_QUEUE;
}