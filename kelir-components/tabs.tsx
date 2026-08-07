import Tab from "@mui/material/Tab";
import MuiTabs from "@mui/material/Tabs";
import * as React from "react";
import type { TabsProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Tabs({ items, defaultValue, style, ...props }: TabsProps) {
  const firstValue = items[0]?.value;
  const [value, setValue] = React.useState<string>(
    defaultValue ?? firstValue ?? "",
  );

  const activeItem = items.find((item) => item.value === value);

  return (
    <div style={{ fontFamily: "inherit", ...style }}>
      <MuiTabs
        {...props}
        value={activeItem ? value : false}
        onChange={(_e, newValue: string) => setValue(newValue)}
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
            style={{
              fontFamily: "inherit",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "none",
              color: item.value === value ? textPrimary : textSecondary,
              minHeight: "44px",
            }}
          />
        ))}
      </MuiTabs>
      <div style={{ paddingTop: css.layout.space.md }}>
        {activeItem?.content ?? null}
      </div>
    </div>
  );
}
