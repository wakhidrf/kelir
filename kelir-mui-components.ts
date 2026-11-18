// MUI component overrides (Button, Card). Split out of kelir-provider.tsx
// (SRP, <= 100 lines); kelir-mui-theme composes them into the MUI theme.
// Behavior is unchanged.

import type { Components, Theme } from "@mui/material/styles";

export const kelirMuiComponents: Components<Theme> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: "var(--control-radius, var(--radius-sm))",
        textTransform: "none",
        fontWeight: 600,
        padding: "var(--control-padding, 12px)",
        fontFamily: "inherit",
        transition: `all var(--motion-duration-hover, 200ms) var(--motion-easing-curve, ease-out)`,
        "&:focus-visible": {
          outline: "none",
          boxShadow: `0 0 0 var(--focus-ring-width) var(--focus-ring-color)`,
          outlineOffset: "var(--focus-ring-offset)",
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "var(--radius-sm)",
        backgroundColor: "var(--color-surface)",
        boxShadow: "var(--shadow-card)",
        border:
          "1px solid var(--color-border-light, rgba(255, 255, 255, 0.4))",
      },
    },
  },
};