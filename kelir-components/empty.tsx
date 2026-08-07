import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import type { EmptyProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Empty({
  title,
  description,
  action,
  icon,
  ...props
}: EmptyProps) {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: css.layout.space.md,
        padding: `${css.layout.space["4xl"]} ${css.layout.space["2xl"]}`,
        textAlign: "center",
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        color: textPrimary,
        fontFamily: "inherit",
        ...props.style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "64px",
          height: "64px",
          borderRadius: "999px",
          backgroundColor: css.colors.primary,
          color: css.on.primary,
          boxShadow: convexShadow,
        }}
      >
        {icon ?? <SentimentDissatisfiedIcon style={{ fontSize: 32 }} />}
      </div>
      {title && (
        <div style={{ fontSize: "16px", fontWeight: 700 }}>{title}</div>
      )}
      {description && (
        <div
          style={{
            fontSize: "14px",
            color: textSecondary,
            maxWidth: "320px",
          }}
        >
          {description}
        </div>
      )}
      {action && <div style={{ marginTop: css.layout.space.xs }}>{action}</div>}
    </div>
  );
}
