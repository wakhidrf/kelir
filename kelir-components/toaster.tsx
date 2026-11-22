"use client";

import Portal from "@mui/material/Portal";
import * as React from "react";
import type { ToastApi, ToasterProps } from "../kelir-kit/kit-feedback";
import { css } from "../kelir-kit/kit-create-css";
import { Toast, ToastStackContext } from "./toast";
import {
  close,
  dismiss,
  getServerSnapshot,
  getSnapshot,
  notify,
  subscribe,
} from "./toast-store";

export { TOAST_QUEUE_LIMIT } from "./toast-store";

const TOAST_AUTO_HIDE_DURATION = 6000;

const toastApi: ToastApi = { notify, close };

export function useToast(): ToastApi {
  return toastApi;
}

export function Toaster({
  maxVisible = 1,
  position = "bottom-end",
  id,
}: ToasterProps) {
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
