import MuiToggleButton from "@mui/material/ToggleButton";
import MuiToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { ToggleGroupProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function ToggleGroup({
  options,
  value,
  defaultValue,
  onChange,
  disabled,
  id,
  "aria-label": ariaLabel,
}: ToggleGroupProps) {
  return (
    <MuiToggleButtonGroup
      exclusive
      value={value}
      defaultValue={defaultValue}
      onChange={(_e, newValue: string | null) => {
        // Exclusive milik kit = selalu satu terpilih; klik ulang diabaikan
        // (bukan deselect) agar kontrak onChange(string) total.
        if (newValue !== null) onChange?.(newValue);
      }}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "inline-flex",
        gap: css.layout.space.sm,
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.sm,
        border: `1px solid ${css.border.light}`,
        boxShadow: css.shadows.convex,
        padding: "6px",
      }}
    >
      {options.map((option) => (
        <MuiToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: css.colors.surface,
            borderRadius: css.radius.sm,
            border: `1px solid ${css.border.light}`,
            boxShadow: css.shadows.convex,
            color: css.colors.textPrimary,
            fontFamily: "inherit",
            fontSize: "14px",
            textTransform: "none",
            padding: `${css.layout.space.sm} 14px`,
            "&:hover": {
              backgroundColor: css.colors.surface,
              boxShadow: css.shadows.concave,
            },
            "&.Mui-selected": {
              backgroundColor: css.colors.primary,
              color: css.on.primary,
              borderColor: css.colors.primary,
              boxShadow: css.shadows.concave,
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
