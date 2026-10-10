"use client";

import * as React from "react";
import type { MessageScrollerProps } from "../kelir-types";
import { css, scrollbarClass, scrollbarCss } from "../kelir-variants";

const textSecondary = css.colors.textSecondary;

export function MessageScroller({
  children,
  onLoadMore,
  hasMore,
  maxHeight = "300px",
}: MessageScrollerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = React.useCallback(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || !hasMore || !onLoadMore) return;
    if (el.scrollTop < 40) {
      onLoadMore();
    }
  };

  return (
    <div
      ref={containerRef}
      className={scrollbarClass}
      onScroll={handleScroll}
      style={{
        overflowY: "auto",
        maxHeight: maxHeight,
        fontFamily: "inherit",
        color: textSecondary,
      }}
    >
      <style>{scrollbarCss}</style>
      {children}
    </div>
  );
}
