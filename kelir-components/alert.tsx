import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import type { AlertProps } from "../kelir-types";
import { css } from "../kelir-variants";

const cardShadow = css.shadows.card;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function Alert({ title, children, ...props }: AlertProps) {
  return (
    <MuiAlert
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: cardShadow,
        border: `1px solid ${css.border.light}`,
        color: textPrimary,
        fontFamily: "inherit",
        ...props.style,
      }}
    >
      {title && (
        <AlertTitle style={{ fontWeight: 700, color: textPrimary }}>
          {title}
        </AlertTitle>
      )}
      {children}
    </MuiAlert>
  );
}
