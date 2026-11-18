import type { TypographyProps } from "../kelir-types";

type Variant = NonNullable<TypographyProps["variant"]>;

export const mappedVariant: Record<
  Variant,
  "h1" | "h2" | "h3" | "body1" | "body2" | "caption"
> = {
  hero: "h1",
  "hero-sm": "h1",
  display: "h1",
  title: "h2",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  stat: "h2",
  "body-md": "body1",
  "body-sm": "body2",
  caption: "caption",
  "label-caps": "body1",
  label: "body1",
};

export const defaultElement: Record<Variant, "h1" | "h2" | "h3" | "p"> = {
  hero: "h1",
  "hero-sm": "h1",
  display: "h1",
  title: "h2",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  stat: "p",
  "body-md": "p",
  "body-sm": "p",
  caption: "p",
  "label-caps": "p",
  label: "p",
};