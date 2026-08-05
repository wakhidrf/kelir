import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import type { BreadcrumbProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Breadcrumb({ items, ...props }: BreadcrumbProps) {
  return (
    <MuiBreadcrumbs
      {...props}
      style={{
        color: textSecondary,
        fontFamily: "inherit",
        fontSize: "14px",
        ...props.style,
      }}
    >
      {items.map((item, index) => {
        const active = item.active ?? index === items.length - 1;
        const style = {
          color: active ? textPrimary : textSecondary,
          fontWeight: active ? 700 : 400,
          cursor: item.href ? "pointer" : "default",
        };
        const label = <span style={style}>{item.label}</span>;
        if (item.href && !active) {
          return (
            <a
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {label}
            </a>
          );
        }
        return (
          <span key={typeof item.label === "string" ? item.label : item.href}>
            {label}
          </span>
        );
      })}
    </MuiBreadcrumbs>
  );
}
