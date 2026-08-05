import type { ScrollAreaProps } from "../kelir-types";
import { css, scrollbarClass, scrollbarCss } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;

export function ScrollArea({
  maxHeight,
  className,
  children,
  style,
  ...props
}: ScrollAreaProps) {
  return (
    <div
      {...props}
      className={[scrollbarClass, className].filter(Boolean).join(" ")}
      style={{
        maxHeight: maxHeight,
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "inherit",
        color: textPrimary,
        ...style,
      }}
    >
      <style>{scrollbarCss}</style>
      {children}
    </div>
  );
}
