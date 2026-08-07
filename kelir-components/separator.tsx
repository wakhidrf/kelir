import MuiDivider from "@mui/material/Divider";
import type { SeparatorProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textSecondary = css.colors.textSecondary;

export function Separator({ label, ...props }: SeparatorProps) {
  return (
    <MuiDivider
      {...props}
      style={{
        borderColor: "rgba(0, 0, 0, 0.08)",
        margin: `${css.layout.space.md} 0`,
        fontFamily: "inherit",
        color: textSecondary,
        fontSize: "12px",
        ...props.style,
      }}
    >
      {label}
    </MuiDivider>
  );
}
