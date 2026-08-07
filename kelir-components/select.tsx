import MuiInputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import type { SelectProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Select({ options, style, ...props }: SelectProps) {
  return (
    <MuiSelect
      {...props}
      input={
        <MuiInputBase
          fullWidth
          style={{
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.sm,
            boxShadow: concaveShadow,
            border: `1px solid ${css.border.light}`,
            color: textPrimary,
            fontFamily: "inherit",
            fontSize: "14px",
            ...style,
          }}
        />
      }
      sx={{
        "& .MuiSelect-select": {
          padding: "10px 36px 10px 14px",
        },
        "& .MuiSelect-icon": {
          color: textSecondary,
          right: "8px",
        },
      }}
      MenuProps={{
        slotProps: {
          paper: {
            style: {
              backgroundColor: neumorphicBg,
              borderRadius: css.radius.sm,
              boxShadow: convexShadow,
              border: `1px solid ${css.border.light}`,
              marginTop: "8px",
            },
          },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          style={{
            color: textPrimary,
            fontFamily: "inherit",
            fontSize: "14px",
          }}
          sx={{
            "&.Mui-selected": {
              backgroundColor: css.colors.primary,
              color: css.on.primary,
            },
            "&.Mui-selected:hover": {
              backgroundColor: css.colors.primary,
              color: css.on.primary,
            },
            "&:hover": {
              backgroundColor: css.colors.primary,
              color: css.on.primary,
              opacity: 0.9,
            },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </MuiSelect>
  );
}
