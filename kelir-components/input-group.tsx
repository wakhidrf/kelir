import type { InputGroupProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;
const textSecondary = css.colors.textSecondary;

export function InputGroup({
  prefix,
  suffix,
  children,
  style,
  ...props
}: InputGroupProps) {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        alignItems: "center",
        gap: css.layout.space.sm,
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        border: `1px solid ${css.border.light}`,
        boxShadow: convexShadow,
        padding: `${css.layout.space.xs} ${css.layout.space.sm}`,
        fontFamily: "inherit",
        ...style,
      }}
    >
      {prefix && (
        <span
          style={{
            color: textSecondary,
            fontSize: "14px",
            whiteSpace: "nowrap",
            display: "inline-flex",
          }}
        >
          {prefix}
        </span>
      )}
      <div style={{ flex: 1, display: "flex", minWidth: 0 }}>{children}</div>
      {suffix && (
        <span
          style={{
            color: textSecondary,
            fontSize: "14px",
            whiteSpace: "nowrap",
            display: "inline-flex",
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}
