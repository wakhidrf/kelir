import MuiToggleButton from "@mui/material/ToggleButton";
import MuiToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { ToggleGroupProps } from "../kelir-types";
import { css } from "../kelir-variants";

// Sealed single-choice group (Gel.3c-2 §6). `separated` (default)
// = a pill holding separate raised buttons, `joined` = one merged pill without
// gap/fill: inactive buttons transparent with secondary text, the active one
// primary. Visual entirely owned by the kit; no ...rest/style/sx.
export function ToggleGroup({
  options,
  value,
  defaultValue,
  onChange,
  variant = "separated",
  disabled,
  size = "md",
  id,
  "aria-label": ariaLabel,
}: ToggleGroupProps) {
  const joined = variant === "joined";
  return (
    <MuiToggleButtonGroup
      exclusive
      value={value}
      defaultValue={defaultValue}
      onChange={(_e, newValue: string | null) => {
        // Kit-owned exclusive = always one selected; repeat clicks are ignored
        // (not deselect) so the onChange(string) contract is total.
        if (newValue !== null) onChange?.(newValue);
      }}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "inline-flex",
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.button,
        ...(joined
          ? { boxShadow: css.shadows.card, overflow: "hidden" }
          : {
              gap: css.layout.space.sm,
              border: `1px solid ${css.border.light}`,
              boxShadow: css.shadows.convex,
              padding: "6px",
            }),
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
            fontFamily: "inherit",
            fontSize: "14px",
            textTransform: "none",
            borderRadius: joined ? 0 : css.radius.button,
            color: joined ? css.colors.textSecondary : css.colors.textPrimary,
            backgroundColor: joined ? "transparent" : css.colors.surface,
            ...(joined
              ? { fontWeight: 600, padding: size === "sm" ? "6px 12px" : size === "lg" ? "12px 18px" : "9px 14px" }
              : {
                  border: `1px solid ${css.border.light}`,
                  boxShadow: css.shadows.convex,
                  padding: size === "sm" ? `${css.layout.space.xs} 12px` : size === "lg" ? `${css.layout.space.md} 18px` : `${css.layout.space.sm} 14px`,
                }),
            "&:hover": joined
              ? { backgroundColor: css.divider }
              : {
                  backgroundColor: css.colors.surface,
                  boxShadow: css.shadows.concave,
                },
            "&.Mui-selected": {
              backgroundColor: css.colors.primary,
              color: css.on.primary,
              ...(joined
                ? null
                : {
                    borderColor: css.colors.primary,
                    boxShadow: css.shadows.concave,
                  }),
            },
            "&.Mui-selected:hover": {
              backgroundColor: css.colors.primary,
            },
            "&.MuiToggleButtonGroup-grouped": {
              borderRadius: joined ? 0 : css.radius.button,
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
