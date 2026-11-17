"use client";

import Portal from "@mui/material/Portal";
import * as React from "react";
import type { ToastApi, ToastProps, ToasterProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Toast, ToastStackContext } from "./toast";

type StoredToast = {
  id: number;
  message: string;
  tone?: ToastProps["tone"];
};

export const TOAST_QUEUE_LIMIT = 20;

const TOAST_AUTO_HIDE_DURATION = 6000;
const EMPTY_QUEUE: readonly StoredToast[] = [];
const listeners = new Set<() => void>();

let queue: readonly StoredToast[] = [];
let nextId = 0;

function emit() {
  for (const listener of listeners) listener();
}

function notify(message: string, tone?: ToastProps["tone"]) {
  const room =
    queue.length >= TOAST_QUEUE_LIMIT ? queue.slice(1) : queue;
  queue = [...room, { id: ++nextId, message, tone }];
  emit();
}

function close() {
  if (queue.length === 0) return;
  queue = queue.slice(1);
  emit();
}

function dismiss(id: number) {
  const next = queue.filter((item) => item.id !== id);
  if (next.length === queue.length) return;
  queue = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) queue = EMPTY_QUEUE;
  };
}

function getSnapshot() {
  return queue;
}

function getServerSnapshot() {
  return EMPTY_QUEUE;
}

const toastApi: ToastApi = { notify, close };

export function useToast(): ToastApi {
  return toastApi;
}

export function Toaster({ maxVisible = 1, position = "bottom-end", id }: ToasterProps) {
  const items = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const requested = Math.floor(maxVisible);
  const visibleCount =
    Number.isFinite(requested) && requested > 0 ? requested : 1;
  const visible = items.slice(0, visibleCount);
  const isTop = position.startsWith("top");
  const isStart = position.endsWith("start");

  if (visible.length === 0) return null;

  return (
    <Portal>
      <div
        id={id}
        style={{
          position: "fixed",
          top: isTop ? css.layout.space.lg : "auto",
          bottom: isTop ? "auto" : css.layout.space.lg,
          left: isStart ? css.layout.space.lg : "auto",
          right: isStart ? "auto" : css.layout.space.lg,
          zIndex: css.layout.zIndex.toast,
          display: "flex",
          flexDirection: isTop ? "column" : "column-reverse",
          alignItems: isStart ? "flex-start" : "flex-end",
          gap: css.layout.space.sm,
          maxWidth: `calc(100vw - ${css.layout.space["2xl"]})`,
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      >
        <ToastStackContext.Provider value>
          {visible.map((item) => (
            <Toast
              key={item.id}
              id={id ? `${id}-${item.id}` : `kelir-toaster-${item.id}`}
              message={item.message}
              tone={item.tone}
              open
              autoHideDuration={TOAST_AUTO_HIDE_DURATION}
              onClose={() => dismiss(item.id)}
            />
          ))}
        </ToastStackContext.Provider>
      </div>
    </Portal>
  );
}
