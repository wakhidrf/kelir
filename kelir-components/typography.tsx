import MuiTypography from "@mui/material/Typography";
import type * as React from "react";
import type { TypographyProps } from "../kelir-kit/kit-typography-props";
import { css } from "../kelir-kit/kit-create-css";
import { mappedVariant, defaultElement } from "./typography-variants";
import { MOBILE_QUERY, MD_QUERY, BRAND_FONT, styleFor, segmentStyle } from "./typography-utils";

type Variant = NonNullable<TypographyProps["variant"]>;

export function Typography({
  children,
  variant = "body-md",
  variantMd,
  variantMobile,
  as,
  level,
  align = "start",
  tone,
  font = "text",
  truncate = false,
  breakAll = false,
  tracking = "normal",
  segments,
  id,
  "aria-label": ariaLabel,
}: TypographyProps) {
  const component = as ?? defaultElement[variant];
  const headingSemantics =
    level !== undefined &&
    (component === "p" || component === "span" || component === "div")
      ? { role: "heading" as const, "aria-level": level }
      : undefined;
  const responsiveVariant =
    variantMd !== undefined || variantMobile !== undefined;
  return (
    <MuiTypography
      component={component}
      variant={mappedVariant[variant]}
      id={id}
      aria-label={ariaLabel}
      {...headingSemantics}
      sx={
        responsiveVariant
          ? {
              ...styleFor(variant, tone, font),
              ...(variantMobile
                ? { [MOBILE_QUERY]: styleFor(variantMobile, tone, font) }
                : null),
              ...(variantMd
                ? { [MD_QUERY]: styleFor(variantMd, tone, font) }
                : null),
            }
          : undefined
      }
      style={{
        fontFamily: font === "brand" ? BRAND_FONT : "inherit",
        margin: 0,
        ...(responsiveVariant ? null : styleFor(variant, tone, font)),
        textAlign: align,
        ...(truncate
          ? ({
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            } as const)
          : null),
        ...(breakAll ? ({ wordBreak: "break-all" } as const) : null),
        ...(tracking === "wide" ? ({ letterSpacing: "6px" } as const) : null),
      }}
    >
      {segments
        ? segments.map((seg, index) =>
            seg.break ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: segmen statis.
              <br key={index} />
            ) : (
              <span key={index} style={segmentStyle(seg)}>
                {seg.text}
              </span>
            ),
          )
        : children}
    </MuiTypography>
  );
}
