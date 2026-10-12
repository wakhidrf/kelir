"use client";

import * as React from "react";
import type { BubbleProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const textPrimary = css.colors.textPrimary;

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

  const bubbleStyles: React.CSSProperties = {
    maxWidth: "80%",
    padding: "10px 14px",
    borderRadius: css.radius.prominent,
    fontSize: "14px",
    lineHeight: 1.5,
    fontFamily: "inherit",
    wordBreak: "break-word",
    boxShadow: convexShadow,
    textAlign: "left",
    appearance: "none",
    cursor: collapsible ? "pointer" : "default",
    transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
    ...(isSent
      ? {
          backgroundColor: css.colors.primary,
          color: css.on.primary,
          borderBottomRightRadius: 6,
        }
      : {
          backgroundColor: css.colors.surface,
          color: textPrimary,
          border: `1px solid ${css.border.light}`,
          borderBottomLeftRadius: 6,
        }),
  };

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
          style={bubbleStyles}
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
        <div style={bubbleStyles}>{children}</div>
      )}
      {reactions && reactions.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "6px",
          }}
        >
          {/* Key = nilai + indeks: reaksi boleh duplikat (mis. dua
              jempol) tanpa peringatan key ganda React; tampilan tetap
              apa adanya (tanpa dedup diam-diam). */}
          {reactions.map((reaction, index) => (
            <span
              key={`${reaction}-${index}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "28px",
                height: "24px",
                padding: `0 ${css.layout.space.sm}`,
                fontSize: "13px",
                borderRadius: "999px",
                backgroundColor: css.colors.surface,
                border: `1px solid ${css.border.light}`,
                boxShadow: convexShadow,
              }}
            >
              {reaction}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
