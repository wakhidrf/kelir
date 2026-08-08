import type * as React from "react";
import type { NavigationMenuProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textSecondary = css.colors.textSecondary;

export function NavigationMenu({
  items,
  style,
  ...props
}: NavigationMenuProps) {
  return (
    <nav
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: css.layout.space.xs,
        fontFamily: "inherit",
        ...style,
      }}
    >
      {items.map((item) => {
        const content = (
          <>
            <span>{item.label}</span>
            {item.active && (
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: css.colors.primary,
                }}
              />
            )}
          </>
        );

        const itemStyle: React.CSSProperties = {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: css.layout.space.sm,
          border: "none",
          background: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: "10px 14px",
          borderRadius: css.radius.sm,
          fontSize: "14px",
          fontWeight: 600,
          color: item.active ? css.on.primary : textSecondary,
          backgroundColor: item.active ? css.colors.primary : "transparent",
          boxShadow: item.active ? css.shadows.concave : "none",
          fontFamily: "inherit",
          transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
        };

        if (item.href) {
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={item.onClick}
              style={{ ...itemStyle, textDecoration: "none" }}
            >
              {content}
            </a>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            style={itemStyle}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
