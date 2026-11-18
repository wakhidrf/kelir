"use client";

import MuiTable from "@mui/material/Table";
import type * as React from "react";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;

export function TableContainer({ children, title }: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.card,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        overflow: "hidden",
        fontFamily: "inherit",
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: 700,
            color: textPrimary,
            padding: `${css.layout.space.md} ${css.layout.space.md} 0`,
            marginBottom: css.layout.space.sm,
            fontFamily: "inherit",
          }}
        >
          {title}
        </div>
      )}
      <MuiTable>{children}</MuiTable>
    </div>
  );
}