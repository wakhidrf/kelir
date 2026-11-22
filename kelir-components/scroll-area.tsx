import type { ScrollAreaProps } from "../kelir-kit/kit-data-display-data";
import { scrollbarClass, scrollbarCss } from "../kelir-kit/kit-scrollbar";
 import { css } from "../kelir-kit/kit-create-css";

const textPrimary = css.colors.textPrimary;

export function ScrollArea({ maxHeight, children }: ScrollAreaProps) {
  return (
    <div
      className={scrollbarClass}
      style={{
        maxHeight: maxHeight,
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "inherit",
        color: textPrimary,
      }}
    >
      <style>{scrollbarCss}</style>
      {children}
    </div>
  );
}
