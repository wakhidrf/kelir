import type { MessageProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Message({
  avatar,
  sender,
  time,
  text,
  align = "left",
  style,
  ...props
}: MessageProps) {
  const isRight = align === "right";

  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isRight ? "flex-end" : "flex-start",
        gap: css.layout.space.xs,
        fontFamily: "inherit",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: css.layout.space.sm,
          fontSize: "12px",
          fontWeight: 600,
          color: textSecondary,
        }}
      >
        {avatar && <span style={{ display: "inline-flex" }}>{avatar}</span>}
        <span>{sender}</span>
        {time && <span style={{ fontWeight: 400, opacity: 0.7 }}>{time}</span>}
      </div>
      <div
        style={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: isRight ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          backgroundColor: isRight ? css.colors.primary : css.colors.surface,
          color: isRight ? css.on.primary : textPrimary,
          boxShadow: css.shadows.convex,
          border: `1px solid ${css.border.light}`,
          fontSize: "14px",
          lineHeight: 1.5,
          textAlign: "left",
        }}
      >
        {text}
      </div>
    </div>
  );
}
