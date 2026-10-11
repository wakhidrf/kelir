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

// Kartu sealed (P1c STYLE.md §6): basis MUI (MuiCard + sub-komponen) untuk
// multi-platform; hanya props kontrak yang dipakai — tanpa ...rest ke DOM,
// tanpa style/sx/className konsumen. Gaya header/konten/footer milik kit;
// `headerAlign` mengatur textAlign judul + subjudul (default `start`);
// `scrollable` menjadikan kartu kolom flex dengan isi scroll internal
// (header/footer tetap; default false; tinggi luar milik konsumen).
export function Card({
  title,
  subtitle,
  headerActions,
  headerAlign = "start",
  scrollable = false,
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
        ...(scrollable
          ? {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }
          : null),
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
