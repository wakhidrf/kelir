import { css, scrollbarClass } from "../kelir-variants";

export const menuScrollbarSx = {
  scrollbarWidth: "thin",
  scrollbarColor: `color-mix(in srgb, ${css.colors.textSecondary} 45%, transparent) ${css.track}`,
  "&::-webkit-scrollbar": { width: 10, height: 10 },
  "&::-webkit-scrollbar-track": {
    background: css.track,
    borderRadius: css.control.radius,
  },
  "&::-webkit-scrollbar-thumb": {
    background: `color-mix(in srgb, ${css.colors.textSecondary} 45%, transparent)`,
    border: "2px solid transparent",
    backgroundClip: "padding-box",
    borderRadius: css.control.radius,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: css.colors.primary,
    border: "2px solid transparent",
    backgroundClip: "padding-box",
  },
};

export { scrollbarClass };