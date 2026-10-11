import MuiBox from "@mui/material/Box";
import type { InputGroupProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function InputGroup({
  prefix,
  suffix,
  children,
  id,
  "aria-label": ariaLabel,
}: InputGroupProps) {
  const adornmentSx = {
    color: css.colors.textSecondary,
    fontSize: "14px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    display: "inline-flex",
  } as const;
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: css.layout.space.sm,
        backgroundColor: css.colors.surface,
        borderRadius: css.control.radius,
        border: `1px solid ${css.border.light}`,
        boxShadow: css.shadows.convex,
        padding: `${css.layout.space.xs} ${css.layout.space.sm}`,
        fontFamily: "inherit",
      }}
    >
      {prefix && (
        <MuiBox component="span" sx={adornmentSx}>
          {prefix}
        </MuiBox>
      )}
      <MuiBox sx={{ flex: 1, display: "flex", minWidth: 0 }}>
        {children}
      </MuiBox>
      {suffix && (
        <MuiBox component="span" sx={adornmentSx}>
          {suffix}
        </MuiBox>
      )}
    </MuiBox>
  );
}
