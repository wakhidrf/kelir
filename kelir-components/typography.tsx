import MuiTypography from "@mui/material/Typography";
import type * as React from "react";
import type { TypographyProps, TypographySegment } from "../kelir-types";
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
  "label-caps": {
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: css.colors.textSecondary,
  },
};

const defaultElement: Record<Variant, "h1" | "h2" | "h3" | "p"> = {
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
};

// Ambang responsif kit (satu sumber: token layout) - mobile 600px untuk
// `variantMobile` (max-width, ambang dikurangi 0.02px seperti komponen lain),
// heroCollapse 768px untuk `variantMd`.
const MOBILE_QUERY = `@media (max-width: calc(${css.layout.breakpoints.mobile} - 0.02px))`;
const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

// Font merek konsumen (dipasang KelirProvider lewat --kelir-font-brand);
// tanpa itu jatuh ke font aktif tema.
const BRAND_FONT =
  "var(--kelir-font-brand, var(--kelir-font-active, sans-serif))";

// Gaya varian + penimpa dari kontrak: tone menimpa warna varian, font
// memilih keluarga teks (identitas konsumen) tanpa CSS konsumen.
function styleFor(
  variant: Variant,
  tone: TypographyProps["tone"],
  font: TypographyProps["font"],
): React.CSSProperties {
  const style: React.CSSProperties = { ...variantStyles[variant] };
  if (tone === "primary") style.color = css.colors.textPrimary;
  else if (tone === "secondary") style.color = css.colors.textSecondary;
  else if (tone === "brand-accent")
    style.color = "var(--kelir-brand-accent, inherit)";
  else if (tone === "brand-ink")
    style.color = "var(--kelir-brand-ink, inherit)";
  if (font === "brand") style.fontFamily = BRAND_FONT;
  return style;
}

// Gaya segmen inline: tetap di dalam satu elemen (satu heading), dari token.
function segmentStyle(seg: TypographySegment): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (seg.tone === "muted") style.color = css.colors.textSecondary;
  else if (seg.tone === "primary") style.color = css.colors.primary;
  if (seg.scale === "sm") {
    style.fontSize = "0.55em";
    style.fontWeight = 500;
  }
  return style;
}

// Teks sealed (P1c STYLE.md §6): hanya props kontrak yang diteruskan ke MUI
// (children, component, variant, align, style milik kit, id/aria/role) -
// tanpa ...rest ke DOM. `as` memilih elemen dokumen; `level` menambah role
// heading + aria-level bila elemennya non-heading (tampilan body tapi outline
// dokumen setara heading) - hierarki dokumen ≠ visual. Bila `as` sudah
// heading, level bawaan elemen yang berlaku. `tone?` = warna teks dari
// token tema (primary/secondary) atau warna merek (brand-accent/brand-ink);
// tanpa = bawaan varian); `font?` = keluarga teks
// (text = font aktif tema, brand = font merek dari KelirProvider.brandFont).
// Varian tambahan: `hero` (judul besar fluid), `hero-sm` (judul besar
// ponsel), dan `stat` (angka besar); `variantMobile?` memilih varian di
// bawah 600px.
// `align` = textAlign milik kit
// (default `left`); `truncate?` = elipsis satu-baris milik kit (default
// `false`, properti dihilangkan penuh saat mati); `breakAll?` = pecah kata
// panjang di mana saja (`word-break: break-all`, default `false`);
// `tracking?` = spasi huruf (`normal` = bawaan varian, `wide` = renggang
// 6 px milik kit untuk kode verifikasi, default `normal`). `segments?` =
// teks inline berhias dalam SATU elemen (heading utuh, bukan heading
// bertingkat): tiap segmen span ber-token, `break` menjadi <br/>; bila
// diisi, menggantikan `children`.
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
        // Varian visual tetap inline (perilaku lama); saat `variantMd` diisi,
        // blok varian pindah ke `sx` agar media query bisa menang.
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
