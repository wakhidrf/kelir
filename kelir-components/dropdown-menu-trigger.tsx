"use client";

import * as React from "react";
import { css } from "../kelir-kit/kit-create-css";
import { Button } from "./button";

type DropdownMenuTriggerProps = {
  trigger: string;
  triggerVariant: "text" | "button";
  truncate: boolean;
  maxWidth?: number;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

// Kit-owned trigger: text = plain text button; button = kit's outline Button
// (button affordance for toolbars). Clicks are handled by the kit for both
// variants.
export function DropdownMenuTrigger({
  trigger,
  triggerVariant,
  truncate,
  maxWidth,
  onClick,
}: DropdownMenuTriggerProps) {
  if (triggerVariant === "button") {
    return (
      <Button variant="outline" onClick={onClick}>
        {trigger}
      </Button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={truncate ? trigger : undefined}
      style={{
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: `6px ${css.layout.space.md}`,
        borderRadius: css.radius.button,
        fontSize: "13px",
        fontWeight: 600,
        color: css.colors.textSecondary,
        fontFamily: "inherit",
        ...(truncate
          ? {
              maxWidth: maxWidth === undefined ? "100%" : `${maxWidth}px`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }
          : null),
      }}
    >
      {trigger}
    </button>
  );
}