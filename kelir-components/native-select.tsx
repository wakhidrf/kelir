import MuiInputBase from "@mui/material/InputBase";
import MuiNativeSelect from "@mui/material/NativeSelect";
import type { NativeSelectProps } from "../kelir-types";
import { css } from "../kelir-variants";

const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function NativeSelect({ options, style, ...props }: NativeSelectProps) {
  return (
    <MuiNativeSelect
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
        "& .MuiNativeSelect-select": {
          padding: "10px 36px 10px 14px",
        },
        "& .MuiNativeSelect-icon": {
          color: textSecondary,
          right: css.layout.space.sm,
        },
        "& option": {
          color: textPrimary,
          backgroundColor: neumorphicBg,
        },
        "& option:disabled": {
          color: textSecondary,
        },
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </MuiNativeSelect>
  );
}
