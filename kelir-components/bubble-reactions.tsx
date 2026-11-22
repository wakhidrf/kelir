import type * as React from "react";
import { css } from "../kelir-kit/kit-create-css";

const convexShadow = css.shadows.convex;

type BubbleReactionsProps = {
  reactions: string[];
};

export function BubbleReactions({ reactions }: BubbleReactionsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        marginTop: "6px",
      }}
    >
      {/* Key = value + index: reactions may duplicate (e.g. two thumbs-up)
          without React duplicate-key warnings; display stays as-is (no silent
          dedup). */}
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
  );
}