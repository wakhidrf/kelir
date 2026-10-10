import MuiBox from "@mui/material/Box";
import type { SpacerProps } from "../kelir-types";
import { css } from "../kelir-variants";

const sizes = {
  xs: css.layout.space.xs,
  sm: css.layout.space.sm,
  md: css.layout.space.md,
  lg: css.layout.space.lg,
} as const;

// Jarak vertikal semantik (P1b STYLE.md). Presentasional: aria-hidden.
// Ukuran union tertutup dari token css.layout.space. Basis MUI (MuiBox)
// untuk multi-platform. Tanpa ...rest ke DOM.
export function Spacer({ size = "md", id }: SpacerProps) {
  return (
    <MuiBox
      id={id}
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: sizes[size],
        flexShrink: 0,
      }}
    />
  );
}
