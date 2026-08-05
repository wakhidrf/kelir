import type { SidebarProps } from "../kelir-types";
import { css } from "../kelir-variants";
import { ScrollArea } from "./scroll-area";

const textPrimary = css.colors.textPrimary;

export function Sidebar({
  header,
  footer,
  children,
  style,
  ...props
}: SidebarProps) {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: "220px",
        maxWidth: "280px",
        height: "100%",
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.sm,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        color: textPrimary,
        fontFamily: "inherit",
        overflow: "hidden",
        ...style,
      }}
    >
      {header && <div style={{ flexShrink: 0 }}>{header}</div>}
      <ScrollArea style={{ flex: 1, minHeight: 0, width: "100%" }}>
        {children}
      </ScrollArea>
      {footer && <div style={{ flexShrink: 0 }}>{footer}</div>}
    </div>
  );
}
