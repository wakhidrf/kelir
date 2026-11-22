import CardHeader from "@mui/material/CardHeader";
import type * as React from "react";
import type { CardProps } from "../kelir-kit/kit-data-display-content";
import { css } from "../kelir-kit/kit-create-css";

interface CardHeaderBlockProps {
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  headerAlign: NonNullable<CardProps["headerAlign"]>;
}

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Card header (internal): title/subtitle/actions + kit typography.
export function CardHeaderBlock({
  title,
  subtitle,
  headerActions,
  headerAlign,
}: CardHeaderBlockProps) {
  return (
    <CardHeader
      title={title}
      subheader={subtitle}
      action={headerActions}
      slotProps={{
        title: {
          variant: "h6",
          style: {
            fontWeight: 700,
            color: textPrimary,
            textAlign: headerAlign,
          },
        },
        subheader: {
          style: {
            color: textSecondary,
            fontSize: "14px",
            textAlign: headerAlign,
          },
        },
      }}
    />
  );
}