import MuiToggleButton from "@mui/material/ToggleButton";
import MuiToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { ToggleGroupProps } from "../kelir-kit/kit-forms-choice";
import { buttonSx, groupSx } from "./toggle-group-styles";

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
      sx={groupSx(joined)}
    >
      {options.map((option) => (
        <MuiToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label}
          sx={buttonSx(joined, size)}
        >
          {option.icon}
          <span>{option.label}</span>
        </MuiToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
}
