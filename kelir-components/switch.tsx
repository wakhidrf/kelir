import MuiSwitch from "@mui/material/Switch";
import type { SwitchProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;

export function Switch({ label, ...props }: SwitchProps) {
  return (
    <label
      htmlFor={props.id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <MuiSwitch {...props} style={props.style} />
      {label && (
        <span
          style={{ color: textPrimary, fontSize: "14px", marginLeft: "4px" }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
