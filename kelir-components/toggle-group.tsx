import MuiToggleButton from "@mui/material/ToggleButton";
import MuiToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type * as React from "react";
import type { ToggleGroupProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function ToggleGroup({
  options,
  exclusive,
  ...props
}: ToggleGroupProps) {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: unknown,
  ) => {
    props.onChange?.(newValue as never, event as never);
  };

  return (
    <MuiToggleButtonGroup
      {...props}
      exclusive={exclusive ?? true}
      onChange={handleChange}
      sx={{
        display: "inline-flex",
        gap: css.layout.space.sm,
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        border: `1px solid ${css.border.light}`,
        boxShadow: convexShadow,
        padding: "6px",
      }}
    >
      {options.map((option) => (
        <MuiToggleButton
          key={option.value}
          value={option.value}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.sm,
            border: `1px solid ${css.border.light}`,
            boxShadow: convexShadow,
            color: textPrimary,
            fontFamily: "inherit",
            fontSize: "14px",
            textTransform: "none",
            padding: `${css.layout.space.sm} 14px`,
            "&:hover": {
              backgroundColor: neumorphicBg,
              boxShadow: concaveShadow,
            },
            "&.Mui-selected": {
              backgroundColor: css.colors.primary,
              color: css.on.primary,
              borderColor: css.colors.primary,
              boxShadow: concaveShadow,
            },
            "&.Mui-selected:hover": {
              backgroundColor: css.colors.primary,
            },
            "&.MuiToggleButtonGroup-grouped": {
              borderRadius: css.radius.sm,
              marginLeft: 0,
              marginRight: 0,
            },
          }}
        >
          {option.icon}
          {option.label}
        </MuiToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
}
