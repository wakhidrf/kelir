import MuiBox from "@mui/material/Box";
import type * as React from "react";
import type { MarkerProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { getMarkerContainer, markerPalettes } from "./marker-styles";

// Sealed semantic marker (P1c STYLE.md §6): MUI basis (MuiBox) for
// multi-platform; `tone` = MEANING (not a raw color); no HTMLAttributes
// inheritance, no consumer style/className/event. Per-variant visuals
// belong entirely to the kit.
export function Marker({
  variant = "status",
  tone = "primary",
  children,
  id,
  "aria-label": ariaLabel,
}: MarkerProps) {
  const palette = markerPalettes[tone];
  const container: React.CSSProperties = {
    ...getMarkerContainer(variant, palette),
    fontFamily: "inherit",
  };

  return (
    <MuiBox id={id} aria-label={ariaLabel} style={container}>
      {variant === "status" && (
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            borderRadius: "999px",
            backgroundColor: palette.bg,
            boxShadow: `0 0 0 3px ${palette.bg}33`,
          }}
        />
      )}
      {variant === "note" && (
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            borderRadius: "999px",
            backgroundColor: palette.fg,
          }}
        />
      )}
      {variant === "separator" && (
        <span
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: css.divider,
          }}
        />
      )}
      <span>{children}</span>
      {variant === "separator" && (
        <span
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: css.divider,
          }}
        />
      )}
    </MuiBox>
  );
}