"use client";

import MuiBox from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import MuiTabs from "@mui/material/Tabs";
import * as React from "react";
import type { TabsProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Tabs({
  items,
  value: valueProp,
  defaultValue,
  onChange,
  id,
  "aria-label": ariaLabel,
}: TabsProps) {
  const firstValue = items[0]?.value;
  const [inner, setInner] = React.useState<string>(
    defaultValue ?? firstValue ?? "",
  );
  const value = valueProp ?? inner;
  const select = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onChange?.(next);
  };

  const activeItem = items.find((item) => item.value === value);

  return (
    <MuiBox id={id} aria-label={ariaLabel} sx={{ fontFamily: "inherit" }}>
      <MuiTabs
        value={activeItem ? value : false}
        onChange={(_e, newValue: string) => select(newValue)}
        textColor="inherit"
        slotProps={{
          indicator: {
            style: { backgroundColor: css.colors.primary, height: "3px" },
          },
        }}
        sx={{
          borderBottom: `1px solid ${css.divider}`,
          minHeight: "44px",
        }}
      >
        {items.map((item) => (
          <Tab
            key={item.value}
            value={item.value}
            label={item.label}
            sx={{
              fontFamily: "inherit",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "none",
              color:
                item.value === value
                  ? css.colors.textPrimary
                  : css.colors.textSecondary,
              minHeight: "44px",
            }}
          />
        ))}
      </MuiTabs>
      <MuiBox sx={{ paddingTop: css.layout.space.md }}>
        {activeItem?.content ?? null}
      </MuiBox>
    </MuiBox>
  );
}
