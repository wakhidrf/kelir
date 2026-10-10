import type { ScrollAreaProps } from "../kelir-types";
import { css, scrollbarClass, scrollbarCss } from "../kelir-variants";

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
