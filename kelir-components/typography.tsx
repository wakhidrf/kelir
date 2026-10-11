import MuiTypography from "@mui/material/Typography";
import type * as React from "react";
import type { TypographyProps } from "../kelir-types";
import { css } from "../kelir-variants";

type Variant = NonNullable<TypographyProps["variant"]>;

// Basis MUI dipertahankan (ritel multi-platform nanti): MuiTypography sebagai
// renderer (kelas + tema + emotion). Visual milik kit — dipetakan ke varian
// MUI terdekat + dioverride eksplisit dari token, SELALU sesudah style MUI
// (inline style menang atas kelas), dan TANPA merge style konsumen (tipe
// sudah melarang style/sx/className; implementasi tidak meneruskan ...rest).
const mappedVariant: Record<
  Variant,
  "h1" | "h2" | "h3" | "body1" | "body2" | "caption"
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  "body-md": "body1",
  "body-sm": "body2",
  caption: "caption",
  "label-caps": "body1",
};

// Skala tipe kit dari token/variabel tema Kelir (sama dengan tema provider:
// h1 2.25rem/700, h2 1.5rem/600, body 1rem/400/1.6, small 0.875rem/500/1.6).
// Tambahan P1c: h3, caption. Konsumen tidak bisa mengubah apa pun di sini.
const variantStyles: Record<Variant, React.CSSProperties> = {
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
  "label-caps": {
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: css.colors.textSecondary,
  },
};

const defaultElement: Record<Variant, "h1" | "h2" | "h3" | "p"> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  "body-md": "p",
  "body-sm": "p",
  caption: "p",
  "label-caps": "p",
};

// Teks sealed (P1c STYLE.md §6): hanya props kontrak yang diteruskan ke MUI
// (children, component, variant, align, style milik kit, id/aria/role) -
// tanpa ...rest ke DOM. `as` memilih elemen dokumen; `level` menambah role
// heading + aria-level bila elemennya non-heading (tampilan body tapi outline
// dokumen setara heading) - hierarki dokumen ≠ visual. Bila `as` sudah
// heading, level bawaan elemen yang berlaku. `align` = textAlign milik kit
// (default `left`).
export function Typography({
  children,
  variant = "body-md",
  as,
  level,
  align = "start",
  id,
  "aria-label": ariaLabel,
}: TypographyProps) {
  const component = as ?? defaultElement[variant];
  const headingSemantics =
    level !== undefined &&
    (component === "p" || component === "span" || component === "div")
      ? { role: "heading" as const, "aria-level": level }
      : undefined;
  return (
    <MuiTypography
      component={component}
      variant={mappedVariant[variant]}
      id={id}
      aria-label={ariaLabel}
      {...headingSemantics}
      style={{
        fontFamily: "inherit",
        margin: 0,
        ...variantStyles[variant],
        textAlign: align,
      }}
    >
      {children}
    </MuiTypography>
  );
}
