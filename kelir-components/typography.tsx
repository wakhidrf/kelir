import MuiTypography from "@mui/material/Typography";
import type * as React from "react";
import type { TypographyProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Typography({ variant = "body-md", ...props }: TypographyProps) {
  const getMappedVariant = (): "h3" | "h4" | "body1" => {
    if (variant === "h1") return "h3";
    if (variant === "h2") return "h4";
    return "body1";
  };

  const getStyleOverrides = (): React.CSSProperties => {
    if (variant === "h1") {
      return { fontWeight: 700, color: textPrimary };
    }
    if (variant === "label-caps") {
      return {
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: textSecondary,
      };
    }
    return { color: textPrimary };
  };

  return (
    <MuiTypography
      {...props}
      variant={getMappedVariant()}
      style={{
        fontFamily: "inherit",
        ...getStyleOverrides(),
        ...props.style,
      }}
    />
  );
}
