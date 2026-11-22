import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import type { BreadcrumbProps } from "../kelir-kit/kit-navigation-menu";
import { css } from "../kelir-kit/kit-create-css";

export function Breadcrumb({ items, id, "aria-label": ariaLabel }: BreadcrumbProps) {
  return (
    <MuiBreadcrumbs
      id={id}
      aria-label={ariaLabel ?? "Breadcrumb"}
      sx={{
        color: css.colors.textSecondary,
        fontFamily: "inherit",
        fontSize: "14px",
      }}
    >
      {items.map((item) => {
        const active = item.active ?? false;
        const label = (
          <span
            style={{
              color: active
                ? css.colors.textPrimary
                : css.colors.textSecondary,
              fontWeight: active ? 700 : 400,
              cursor: item.href && !active ? "pointer" : "default",
            }}
          >
            {item.label}
          </span>
        );
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
        return <span key={item.label}>{label}</span>;
      })}
    </MuiBreadcrumbs>
  );
}
