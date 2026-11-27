import MuiInputBase from "@mui/material/InputBase";
import MuiNativeSelect from "@mui/material/NativeSelect";
import type { NativeSelectProps } from "../kelir-kit/kit-forms-select";
import { css } from "../kelir-kit/kit-create-css";
import { getControlMetrics, getControlSurfaceStyle } from "./input";
import { Typography } from "./typography";

export function NativeSelect({
  options,
  value,
  defaultValue,
  onChange,
  label,
  disabled,
  size = "md",
  id,
  "aria-label": ariaLabel,
}: NativeSelectProps) {
  const { small, paddingBlock, paddingInline } = getControlMetrics(size);
  const iconGutter = small ? "32px" : "36px";
  return (
    <>
      {label && <Typography variant="label-caps">{label}</Typography>}
      <MuiNativeSelect
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        id={id}
        // MUI v9: aria-label does not reach the native input when only on the root -
        // (Gel.2 finding on Checkbox/Switch). NativeSelect renders its own
        // <select>; aria on the root is enough for the listbox role.
        aria-label={ariaLabel ?? label}
        input={<MuiInputBase fullWidth style={getControlSurfaceStyle(size)} />}
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
            padding: `${paddingBlock} ${iconGutter} ${paddingBlock} ${paddingInline}`,
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
