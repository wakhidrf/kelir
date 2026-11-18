import MuiBox from "@mui/material/Box";
import type * as React from "react";
import type { GridProps } from "../kelir-types";
import { asideWidths, collapsePx, gaps, PIN_HEIGHT, PIN_MAX } from "./grid-layout";

type GridAsideProps = {
  children: React.ReactNode;
  id?: string;
  ariaLabel?: string;
  gap: NonNullable<GridProps["gap"]>;
  asideWidth: NonNullable<GridProps["asideWidth"]>;
  collapse: NonNullable<GridProps["collapse"]>;
  pinned: boolean;
};

export function GridAside({
  children,
  id,
  ariaLabel,
  gap,
  asideWidth,
  collapse,
  pinned,
}: GridAsideProps) {
  const bp = collapsePx[collapse];
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: gaps[gap],
        alignItems: "start",
        [`@media (min-width: ${bp})`]: {
          gridTemplateColumns: `${asideWidths[asideWidth]}px minmax(0, 1fr)`,
          ...(pinned
            ? {
                height: PIN_HEIGHT,
                maxHeight: PIN_MAX,
                alignItems: "stretch",
              }
            : {}),
        },
        "& > *": { minWidth: 0, minHeight: 0 },
      }}
    >
      {children}
    </MuiBox>
  );
}