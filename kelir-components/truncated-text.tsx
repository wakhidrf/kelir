"use client";

import * as React from "react";
import type { TruncatedTextProps } from "../kelir-types";

export function TruncatedText({
  text,
  maxWidth,
  id,
  "aria-label": ariaLabel,
}: TruncatedTextProps) {
  return (
    <span
      id={id}
      aria-label={ariaLabel}
      title={text}
      style={{
        display: "block",
        maxWidth: maxWidth === undefined ? "100%" : `${maxWidth}px`,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {text}
    </span>
  );
}
