import MuiInputBase from "@mui/material/InputBase";
import MuiNativeSelect from "@mui/material/NativeSelect";
import type { NativeSelectProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Typography } from "./typography";

export function NativeSelect({
  options,
  value,
  defaultValue,
  onChange,
  label,
  disabled,
  id,
  "aria-label": ariaLabel,
}: NativeSelectProps) {
  return (
    <>
      {label && <Typography variant="label-caps">{label}</Typography>}
      <MuiNativeSelect
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        id={id}
        // MUI v9: aria-label tak sampai input native bila hanya di root —
        // (temuan Gel.2 pada Checkbox/Switch). NativeSelect merender
        // <select> sendiri; aria di root cukup untuk peran listbox.
        aria-label={ariaLabel ?? label}
        input={
          <MuiInputBase
            fullWidth
            style={{
              backgroundColor: css.colors.surface,
              borderRadius: css.control.radius,
              boxShadow: css.shadows.concave,
              border: `1px solid ${css.border.light}`,
              backdropFilter: css.motion.blur.backdrop,
              WebkitBackdropFilter: css.motion.blur.backdrop,
              color: css.colors.textPrimary,
              fontFamily: "inherit",
              fontSize: "14px",
            }}
          />
        }
        sx={{
          "&.Mui-focused": {
            "& .MuiInputBase-root": {
              borderColor: css.colors.primary,
            },
          },
          "&:focus-visible": {
            outline: `${css.focusRing.width} solid ${css.focusRing.color}`,
            outlineOffset: css.focusRing.offset,
          },
          "& .MuiNativeSelect-select": {
            padding: "10px 36px 10px 14px",
          },
          "& .MuiNativeSelect-icon": {
            color: css.colors.textSecondary,
            right: css.layout.space.sm,
          },
          "& option": {
            color: css.colors.textPrimary,
            backgroundColor: css.colors.surface,
          },
          "& option:disabled": {
            color: css.colors.textSecondary,
          },
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </MuiNativeSelect>
    </>
  );
}
