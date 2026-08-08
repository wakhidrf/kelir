import MuiCard from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import type { CardProps } from "../kelir-types";
import { css } from "../kelir-variants";

const cardShadow = css.shadows.card;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Card({
  title,
  subtitle,
  headerActions,
  footer,
  children,
  ...props
}: CardProps) {
  return (
    <MuiCard
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: cardShadow,
        border: `1px solid ${css.border.medium}`,
        backdropFilter: surfaceBlur,
        WebkitBackdropFilter: surfaceBlur,
        fontFamily: "inherit",
        ...props.style,
      }}
    >
      {(title || subtitle || headerActions) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={headerActions}
          slotProps={{
            title: {
              variant: "h6",
              style: { fontWeight: 700, color: textPrimary },
            },
            subheader: {
              style: { color: textSecondary, fontSize: "14px" },
            },
          }}
        />
      )}
      <CardContent style={{ color: textPrimary }}>{children}</CardContent>
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
