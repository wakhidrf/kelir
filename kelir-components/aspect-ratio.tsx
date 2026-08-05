import type { AspectRatioProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const neumorphicBg = css.colors.surface;

export function AspectRatio({
  ratio = 16 / 9,
  children,
  ...props
}: AspectRatioProps) {
  return (
    <div
      {...props}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${ratio}`,
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        overflow: "hidden",
        ...props.style,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}
