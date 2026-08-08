import MuiInputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import type { SelectProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
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
            backdropFilter: surfaceBlur,
            WebkitBackdropFilter: surfaceBlur,
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
          right: css.layout.space.sm,
        },
        "&.Mui-focused": {
          borderColor: css.colors.primary,
          "& .MuiInputBase-root": {
            borderColor: css.colors.primary,
          },
        },
        "&:focus-visible": {
          outline: `${css.focusRing.width} solid ${css.focusRing.color}`,
          outlineOffset: css.focusRing.offset,
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
              backdropFilter: surfaceBlur,
              WebkitBackdropFilter: surfaceBlur,
              marginTop: css.layout.space.sm,
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
