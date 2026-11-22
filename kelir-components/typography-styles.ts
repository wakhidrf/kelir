import type * as React from "react";
import type { TypographyProps } from "../kelir-kit/kit-typography-props";
import { css } from "../kelir-kit/kit-create-css";

type Variant = NonNullable<TypographyProps["variant"]>;

export const variantStyles: Record<Variant, React.CSSProperties> = {
  h1: {
    fontSize: "var(--type-h1, 2.25rem)",
    fontWeight: "var(--type-weight-h1, 700)",
    color: css.colors.textPrimary,
  },
  h2: {
    fontSize: "var(--type-h2, 1.5rem)",
    fontWeight: "var(--type-weight-h2, 600)",
    color: css.colors.textPrimary,
  },
  h3: {
    fontSize: "var(--type-h3, 1.25rem)",
    fontWeight: "var(--type-weight-h3, 600)",
    color: css.colors.textPrimary,
  },
  display: {
    fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-1.5px",
    color: css.colors.textPrimary,
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: css.colors.textPrimary,
  },
  hero: {
    fontSize: "var(--type-hero, 2.6rem)",
    fontWeight: "var(--type-weight-hero, 800)",
    lineHeight: 1.1,
    letterSpacing: "var(--type-letterspacing-hero, -1px)",
    color: css.colors.textPrimary,
  },
  "hero-sm": {
    fontSize: "var(--type-hero-sm, 1.8rem)",
    fontWeight: "var(--type-weight-hero, 800)",
    lineHeight: 1.1,
    letterSpacing: "var(--type-letterspacing-hero, -1px)",
    color: css.colors.textPrimary,
  },
  stat: {
    fontSize: "var(--type-stat, 1.875rem)",
    fontWeight: "var(--type-weight-stat, 800)",
    lineHeight: 1.2,
    color: css.colors.textPrimary,
  },
  "body-md": {
    fontSize: "var(--type-body, 1rem)",
    fontWeight: "var(--type-weight-body, 400)",
    lineHeight: "var(--type-lineheight-body, 1.6)",
    color: css.colors.textPrimary,
  },
  "body-sm": {
    fontSize: "var(--type-small, 0.875rem)",
    fontWeight: "var(--type-weight-label, 500)",
    lineHeight: "var(--type-lineheight-body, 1.6)",
    color: css.colors.textPrimary,
  },
  caption: {
    fontSize: "var(--type-caption, 0.75rem)",
    fontWeight: 400,
    lineHeight: 1.5,
    color: css.colors.textSecondary,
  },
  label: {
    fontSize: "var(--type-small, 0.875rem)",
    fontWeight: 700,
    lineHeight: 1.5,
    color: css.colors.textPrimary,
  },
  "label-caps": {
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: css.colors.textSecondary,
  },
};