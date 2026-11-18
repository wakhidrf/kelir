"use client";

import * as React from "react";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function pageButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "6px 14px",
    border: `1px solid ${css.border.light}`,
    borderRadius: css.radius.button,
    backgroundColor: neumorphicBg,
    color: textPrimary,
    boxShadow: convexShadow,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
    fontSize: "12px",
    fontWeight: 600,
    transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
  };
}

export function DataTablePagination({
  page,
  pageCount,
  rowsPerPage,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  const safePage = Math.min(page, pageCount - 1);
  const isFirst = safePage === 0;
  const isLast = safePage >= pageCount - 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${css.layout.space.md} ${css.layout.space.lg}`,
        borderTop: `1px solid ${css.divider}`,
      }}
    >
      <span style={{ fontSize: "12px", color: textSecondary }}>
        Page {safePage + 1} of {pageCount}
      </span>
      <div style={{ display: "flex", gap: css.layout.space.sm }}>
        <button
          type="button"
          disabled={isFirst}
          onClick={() => onPageChange(Math.max(0, safePage - 1))}
          style={pageButtonStyle(isFirst)}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={() => onPageChange(Math.min(pageCount - 1, safePage + 1))}
          style={pageButtonStyle(isLast)}
        >
          Next
        </button>
      </div>
    </div>
  );
}