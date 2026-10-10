import type { AspectRatioProps } from "../kelir-types";
import { css } from "../kelir-variants";

// AspectRatio sealed (Gel.3c-6 STYLE.md §6): bingkai rasio milik kit,
// children slot media. Tanpa style/sx/className.
export function AspectRatio({ ratio = 16 / 9, children }: AspectRatioProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${ratio}`,
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.sm,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}
