"use client";

import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import { useRef, useState } from "react";
import type { SelectProps } from "../kelir-kit/kit-forms-select";
import { css } from "../kelir-kit/kit-create-css";
import { Stack } from "./stack";
import { Typography } from "./typography";
import { KelirSelectInput } from "./select-input";
import {
  getMenuSlotProps,
  getSelectSx,
  getMenuItemStyle,
  getMenuItemSx,
} from "./select-menu-props";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  label,
  placeholder,
  disabled = false,
  size = "md",
  id,
  "aria-label": ariaLabel,
}: SelectProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  const selectedLabel = options.find((o) => o.value === (value ?? ""))?.label;
  const small = size === "xs" || size === "sm";

  return (
    <Stack gap="xs">
      {label && <Typography variant="label-caps">{label}</Typography>}
      <MuiSelect
        ref={anchorRef as never}
        value={value ?? ""}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value as string)}
        disabled={disabled}
        displayEmpty
        id={id}
        aria-label={ariaLabel ?? label}
        input={
          <KelirSelectInput
            style={{
              backgroundColor: neumorphicBg,
              borderRadius: css.control.radius,
              boxShadow: concaveShadow,
              border: `1px solid ${css.border.light}`,
              backdropFilter: surfaceBlur,
              WebkitBackdropFilter: surfaceBlur,
              color: textPrimary,
              fontFamily: "inherit",
              fontSize: small ? "13px" : "14px",
              fontWeight: small ? 500 : 400,
            }}
          />
        }
        renderValue={(v) =>
          v === "" ? (
            <span style={{ color: textSecondary }}>
              {placeholder ?? selectedLabel ?? ""}
            </span>
          ) : (
            (selectedLabel ?? v) as string
          )
        }
        sx={getSelectSx(size)}
        onOpen={() => {
          if (anchorRef.current) {
            setMenuWidth(anchorRef.current.getBoundingClientRect().width);
          }
        }}
        MenuProps={getMenuSlotProps(menuWidth)}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            style={getMenuItemStyle()}
            sx={getMenuItemSx()}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </Stack>
  );
}
