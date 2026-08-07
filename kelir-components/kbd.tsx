import type { KbdProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;

export function Kbd({ children, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "26px",
        padding: `${css.layout.space.xs} 9px`,
        borderRadius: css.layout.space.sm,
        backgroundColor: neumorphicBg,
        border: `1px solid ${css.border.light}`,
        boxShadow: convexShadow,
        color: textPrimary,
        fontFamily: "inherit",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        ...props.style,
      }}
    >
      {children}
    </kbd>
  );
}
