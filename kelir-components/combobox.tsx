import MuiAutocomplete from "@mui/material/Autocomplete";
import type { ComboboxProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { Input } from "./input";
import { Label } from "./label";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Combobox({ label, placeholder, ...props }: ComboboxProps) {
  return (
    <MuiAutocomplete
      {...props}
      renderInput={(params) => {
        const { ref, ...inputRootProps } = params.slotProps.input;
        return (
          <div style={{ position: "relative", width: "100%" }}>
            {label && (
              <Label htmlFor={params.id} style={{ marginBottom: "6px" }}>
                {label}
              </Label>
            )}
            <Input
              inputRef={ref}
              inputProps={params.slotProps.htmlInput}
              placeholder={placeholder}
              fullWidth
              {...inputRootProps}
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
