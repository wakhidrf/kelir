"use client";

import * as React from "react";

export function usePanelKey<TPanel extends React.ReactNode>(
): (panel: TPanel) => string {
  const elementIdCache = React.useRef(new WeakMap<object, string>());
  const nextElementId = React.useRef(0);

  return (panel: TPanel): string => {
    if (React.isValidElement(panel)) {
      if (panel.key != null) return `kelir-${String(panel.key)}`;
      const cached = elementIdCache.current.get(panel);
      if (cached) return cached;
      const id = `kelir-panel-${nextElementId.current}`;
      nextElementId.current += 1;
      elementIdCache.current.set(panel, id);
      return id;
    }
    return `kelir-${typeof panel}`;
  };
}