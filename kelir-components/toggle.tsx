import MuiToggleButton from "@mui/material/ToggleButton";
import * as React from "react";
import type { ToggleProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Toggle({
  pressed: pressedProp,
  defaultPressed,
  onPressedChange,
  children,
  disabled,
  id,
  "aria-label": ariaLabel,
}: ToggleProps) {
  // Mandiri tak-terkontrol (MuiToggleButton tanpa grup tak punya
  // defaultSelected): state milik kit bila `pressed` tak diberikan.
  const [inner, setInner] = React.useState(defaultPressed ?? false);
  const pressed = pressedProp ?? inner;
  const flip = () => {
    const next = !pressed;
    if (pressedProp === undefined) setInner(next);
    onPressedChange?.(next);
  };
  return (
    <MuiToggleButton
      value="kelir-toggle"
      selected={pressed}
      onChange={flip}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel ?? children}
      sx={{
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.button,
        border: `1px solid ${css.border.light}`,
        boxShadow: css.shadows.convex,
        color: css.colors.textPrimary,
        fontFamily: "inherit",
        fontSize: "14px",
        textTransform: "none",
        padding: `10px ${css.layout.space.lg}`,
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
      }}
    >
      {children}
    </MuiToggleButton>
  );
}
