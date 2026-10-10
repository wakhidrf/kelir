import MuiAutocomplete from "@mui/material/Autocomplete";
import MuiInputBase from "@mui/material/InputBase";
import type { ComboboxProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { getInputStyle, inputFocusSx } from "./input";
import { Label } from "./label";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Combobox({
  options,
  value,
  defaultValue,
  onChange,
  label,
  placeholder,
  disabled,
}: ComboboxProps) {
  return (
    <MuiAutocomplete<string, false, false, false>
      options={options}
      value={value ?? null}
      defaultValue={defaultValue ?? undefined}
      // Adaptor semantik: MUI kirim (event, value); kontrak kit value saja.
      onChange={onChange ? (_e, next) => onChange(next) : undefined}
      disabled={disabled}
      renderInput={(params) => {
        const { ref, ...inputRootProps } = params.slotProps.input;
        return (
          <div style={{ position: "relative", width: "100%" }}>
            {label && <Label htmlFor={params.id}>{label}</Label>}
            {/* Komposit internal: render MuiInputBase langsung (bukan Input
            yang sealed) karena Autocomplete WAJIB wiring ref/inputProps/
            adornment MUI ke elemen input. Visual tetap milik kit via
            helper internal getInputStyle/inputFocusSx — bukan style konsumen. */}
            <MuiInputBase
              inputRef={ref}
              inputProps={params.slotProps.htmlInput}
              placeholder={placeholder}
              fullWidth
              {...inputRootProps}
              style={getInputStyle("medium")}
              sx={inputFocusSx}
            />
          </div>
        );
      }}
      sx={{
        width: "100%",
        "& .MuiAutocomplete-paper": {
          backgroundColor: neumorphicBg,
          borderRadius: css.radius.sm,
          boxShadow: convexShadow,
          border: `1px solid ${css.border.light}`,
          backdropFilter: surfaceBlur,
          WebkitBackdropFilter: surfaceBlur,
          marginTop: css.layout.space.sm,
        },
        "& .MuiAutocomplete-listbox": {
          padding: css.layout.space.xs,
        },
        "& .MuiAutocomplete-option": {
          borderRadius: css.radius.sm,
          color: textPrimary,
          fontFamily: "inherit",
          fontSize: "14px",
          padding: `${css.layout.space.sm} ${css.layout.space.md}`,
        },
        "& .MuiAutocomplete-option.Mui-focused": {
          backgroundColor: css.track,
        },
        "& .MuiAutocomplete-option[aria-selected='true']": {
          backgroundColor: css.colors.primary,
          color: css.on.primary,
        },
        "& .MuiAutocomplete-popupIndicator": {
          color: textSecondary,
        },
        "& .MuiAutocomplete-clearIndicator": {
          color: textSecondary,
        },
      }}
    />
  );
}
