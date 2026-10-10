import MuiBox from "@mui/material/Box";
import type { MessageProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Message({
  avatar,
  sender,
  time,
  text,
  align = "left",
  id,
  "aria-label": ariaLabel,
}: MessageProps) {
  const isRight = align === "right";
  return (
    <MuiBox
      id={id}
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isRight ? "flex-end" : "flex-start",
        gap: css.layout.space.xs,
        fontFamily: "inherit",
      }}
    >
      <MuiBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: css.layout.space.sm,
          fontSize: "12px",
          fontWeight: 600,
          color: css.colors.textSecondary,
        }}
      >
        {avatar && (
          <MuiBox component="span" sx={{ display: "inline-flex" }}>
            {avatar}
          </MuiBox>
        )}
        <MuiBox component="span">{sender}</MuiBox>
        {time && (
          <MuiBox component="span" sx={{ fontWeight: 400, opacity: 0.7 }}>
            {time}
          </MuiBox>
        )}
      </MuiBox>
      <MuiBox
        sx={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: isRight ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          backgroundColor: isRight ? css.colors.primary : css.colors.surface,
          color: isRight ? css.on.primary : css.colors.textPrimary,
          boxShadow: css.shadows.convex,
          border: `1px solid ${css.border.light}`,
          fontSize: "14px",
          lineHeight: 1.5,
          textAlign: "left",
        }}
      >
        {text}
      </MuiBox>
    </MuiBox>
  );
}
