import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import MuiBox from "@mui/material/Box";
import type { EmptyProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Empty({
  title,
  description,
  action,
  icon,
  id,
  "aria-label": ariaLabel,
}: EmptyProps) {
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: css.layout.space.md,
        padding: `${css.layout.space["4xl"]} ${css.layout.space["2xl"]}`,
        textAlign: "center",
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.sm,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        color: css.colors.textPrimary,
        fontFamily: "inherit",
      }}
    >
      <MuiBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "64px",
          height: "64px",
          borderRadius: "999px",
          backgroundColor: css.colors.primary,
          color: css.on.primary,
          boxShadow: css.shadows.convex,
        }}
      >
        {icon ?? <SentimentDissatisfiedIcon sx={{ fontSize: 32 }} />}
      </MuiBox>
      {title && (
        <MuiBox component="span" sx={{ fontSize: "16px", fontWeight: 700 }}>
          {title}
        </MuiBox>
      )}
      {description && (
        <MuiBox
          component="span"
          sx={{
            fontSize: "14px",
            color: css.colors.textSecondary,
            maxWidth: "320px",
          }}
        >
          {description}
        </MuiBox>
      )}
      {action && (
        <MuiBox sx={{ marginTop: css.layout.space.xs }}>{action}</MuiBox>
      )}
    </MuiBox>
  );
}
