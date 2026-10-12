import MuiTooltip from "@mui/material/Tooltip";
import type { TooltipProps } from "../kelir-types";
import { css } from "../kelir-variants";

export function Tooltip({
  title,
  children,
  id,
  "aria-label": ariaLabel,
}: TooltipProps) {
  // Anak kustom (mis. Button Kelir, sealed tanpa ...rest) tak meneruskan
  // ref + handler hover/fokus yang disuntik MUI via clone ΓÇö tooltip tak
  // pernah buka. Bungkus host span milik kit (pola anjuran MUI): jangkar
  // + handler menempel di span, anak tampil apa adanya. Elemen host
  // (mis. <button> natif) diteruskan langsung tanpa bungkus.
  const trigger =
    typeof children.type === "string" ? (
      children
    ) : (
      <span style={{ display: "inline-flex" }}>{children}</span>
    );
  return (
    <MuiTooltip
      title={title}
      arrow
      id={id}
      aria-label={ariaLabel}
      slotProps={{
        tooltip: {
          style: {
            backgroundColor: css.colors.surface,
            borderRadius: css.radius.surface,
            boxShadow: css.shadows.convex,
            border: `1px solid ${css.border.light}`,
            backdropFilter: css.motion.blur.backdrop,
            WebkitBackdropFilter: css.motion.blur.backdrop,
            color: css.colors.textPrimary,
            fontSize: "12px",
            fontFamily: "inherit",
          },
        },
        arrow: {
          style: {
            color: css.colors.surface,
          },
        },
      }}
    >
      {trigger}
    </MuiTooltip>
  );
}
