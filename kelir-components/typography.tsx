import MuiTypography from "@mui/material/Typography";
import type * as React from "react";
import type { TypographyProps, TypographySegment } from "../kelir-types";
import { css } from "../kelir-variants";

type Variant = NonNullable<TypographyProps["variant"]>;

// MUI base retained (for future multi-platform retail): MuiTypography as the
// renderer (classes + theme + emotion). Visuals owned by the kit — mapped to the
// nearest MUI variant + explicitly overridden from tokens, ALWAYS after MUI styles
// (inline style wins over classes), and WITHOUT merging consumer style (the type
// already forbids style/sx/className; the implementation doesn't forward ...rest).
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
  label: "body1",
};

// Kit type scale from Kelir theme tokens/variables (same as the provider theme:
// h1 2.25rem/700, h2 1.5rem/600, body 1rem/400/1.6, small 0.875rem/500/1.6).
// P1c additions: h3, caption. Consumers can't change anything here.
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
  label: "p",
};

// Kit responsive breakpoints (single source: the layout token) - mobile 600px for
// `variantMobile` (max-width, breakpoint reduced by 0.02px like other components),
// heroCollapse 768px for `variantMd`.
const MOBILE_QUERY = `@media (max-width: calc(${css.layout.breakpoints.mobile} - 0.02px))`;
const MD_QUERY = `@media (min-width: ${css.layout.breakpoints.heroCollapse})`;

// Consumer brand font (installed by KelirProvider via --kelir-font-brand);
// without it, falls back to the theme's active font.
const BRAND_FONT =
  "var(--kelir-font-brand, var(--kelir-font-active, sans-serif))";

// Variant style + overrides from the contract: tone overrides the variant color, font
// picks the text family (consumer identity) without consumer CSS.
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

// Inline segment style: stays within a single element (one heading), from tokens.
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

// Sealed text (P1c STYLE.md §6): only contract props are forwarded to MUI
// (children, component, variant, align, kit-owned style, id/aria/role) -
// no ...rest to the DOM. `as` picks the document element; `level` adds a heading
// role + aria-level when the element is a non-heading (body appearance but a
// heading-equivalent document outline) - document hierarchy ≠ visual. When `as` is
// already a heading, the element's default level applies. `tone?` = text color from
// theme tokens (primary/secondary) or brand color (brand-accent/brand-ink);
// without = variant default); `font?` = text family
// (text = theme active font, brand = brand font from KelirProvider.brandFont).
// Additional variants: `hero` (fluid large heading), `hero-sm` (large mobile
// heading), and `stat` (large number); `variantMobile?` picks the variant below
// 600px.
// `align` = kit-owned textAlign
// (default `left`); `truncate?` = kit-owned one-line ellipsis (default
// `false`, property fully omitted when off); `breakAll?` = break long words
// anywhere (`word-break: break-all`, default `false`);
// `tracking?` = letter spacing (`normal` = variant default, `wide` = kit's loose
// 6 px for verification codes, default `normal`). `segments?` =
// styled inline text within ONE element (a whole heading, not nested
// headings): each segment is a tokenized span, `break` becomes <br/>; when
// provided, it replaces `children`.
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
        // Visual variant stays inline (legacy behavior); when `variantMd` is set,
        // the variant block moves to `sx` so the media query can take over.
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
