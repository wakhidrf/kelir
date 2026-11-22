"use client";

import * as React from "react";
import type { BubbleProps } from "../kelir-kit/kit-data-display-text";
import { BubbleReactions } from "./bubble-reactions";
import { getBubbleStyle } from "./bubble-style";

export function Bubble({
  variant = "received",
  align,
  reactions,
  collapsible = false,
  children,
}: BubbleProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const isSent = variant === "sent";
  const side = align ?? (isSent ? "end" : "start");
  const bubbleStyle = getBubbleStyle(isSent, collapsible);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: side === "end" ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      {collapsible ? (
        <button
          type="button"
          style={bubbleStyle}
          title={collapsed ? "Click to expand" : "Click to collapse"}
          onClick={() => setCollapsed((c) => !c)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setCollapsed((c) => !c);
            }
          }}
        >
          {collapsed ? "•••" : children}
        </button>
      ) : (
        <div style={bubbleStyle}>{children}</div>
      )}
      {reactions && reactions.length > 0 && (
        <BubbleReactions reactions={reactions} />
      )}
    </div>
  );
}
