import MuiBox from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import type { CardProps } from "../kelir-types";
import { css, statusColors } from "../kelir-variants";

const cardShadow = css.shadows.card;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

// Kit-owned side strip (solid, Marker-border precedent): token breathing width.
const flagColors = {
  danger: css.destructive,
  warn: statusColors.warning.bg,
} as const;

// Card sealed (P1c STYLE.md §6): MUI-based (MuiCard + sub-components) for
// multi-platform; only contract props are used - no ...rest to the DOM,
// no consumer style/sx/className. Header/content/footer styles belong to the
// kit; `headerAlign` sets the title + subtitle textAlign (default `start`);
// `scrollable` makes the card a flex column with internal scrolling content
// (header/footer stay; default false; outer height owned by the consumer).
// `flag?` = absolute status strip on the card side (default no strip;
// strip corners inherit the card radius).
export function Card({
  title,
  subtitle,
  headerActions,
  headerAlign = "start",
  scrollable = false,
  overflow = "hidden",
  flag,
  footer,
  children,
  id,
  "aria-label": ariaLabel,
}: CardProps) {
  return (
    <MuiCard
      id={id}
      aria-label={ariaLabel}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.card,
        boxShadow: cardShadow,
        border: `1px solid ${css.border.medium}`,
        backdropFilter: surfaceBlur,
        WebkitBackdropFilter: surfaceBlur,
        fontFamily: "inherit",
        // `overflow` MEANING (default `hidden` = old behavior). Only
        // `visible` is written inline; `hidden` keeps MUI's default
        // (zero visual change). `scrollable` cards still clip edges.
        overflow: scrollable ? "hidden" : overflow === "visible" ? "visible" : undefined,
        ...(scrollable
          ? {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
            }
          : null),
        ...(flag ? ({ position: "relative" } as const) : null),
      }}
    >
      {flag && (
        <MuiBox
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: css.layout.space.xs,
            backgroundColor: flagColors[flag],
            borderTopLeftRadius: "inherit",
            borderBottomLeftRadius: "inherit",
          }}
        />
      )}
      {(title || subtitle || headerActions) && (
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
      )}
      <CardContent
        style={{
          color: textPrimary,
          ...(scrollable
            ? { flex: 1, minHeight: 0, overflowY: "auto" }
            : null),
        }}
      >
        {children}
      </CardContent>
      {footer && (
        <CardActions
          style={{
            borderTop: `1px solid ${css.divider}`,
            padding: `${css.layout.space.md} ${css.layout.space.lg}`,
          }}
        >
          {footer}
        </CardActions>
      )}
    </MuiCard>
  );
}
