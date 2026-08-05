import FormControlLabel from "@mui/material/FormControlLabel";
import MuiRadio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import type { RadioGroupProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function RadioGroup({ options, style, ...props }: RadioGroupProps) {
  return (
    <MuiRadioGroup
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={
            <MuiRadio
              sx={{
                color: textSecondary,
                "&.Mui-checked": {
                  color: css.colors.primary,
                },
                "&.Mui-checked:hover": {
                  color: css.colors.primary,
                },
              }}
            />
          }
          label={
            <span
              style={{
                color: textPrimary,
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            >
              {option.label}
            </span>
          }
          style={{ marginRight: 0 }}
        />
      ))}
    </MuiRadioGroup>
  );
}
