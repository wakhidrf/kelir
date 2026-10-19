import type { AspectRatioProps } from "../kelir-types";
import { css } from "../kelir-variants";

// AspectRatio sealed (Gel.3c-6 STYLE.md §6): bingkai rasio milik kit,
// children slot media. `plain?` = tanpa permukaan kit (logo/ilustrasi).
// Tanpa style/sx/className.
export function AspectRatio({
  ratio = 16 / 9,
  children,
  plain = false,
}: AspectRatioProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${ratio}`,
        ...(plain
          ? null
          : {
              backgroundColor: css.colors.surface,
              borderRadius: css.radius.card,
              boxShadow: css.shadows.convex,
              border: `1px solid ${css.border.light}`,
            }),
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}
