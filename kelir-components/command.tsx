import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import type { CommandProps } from "../kelir-types";
import { css } from "../kelir-variants";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Command({
  placeholder,
  groups,
  style,
  ...props
}: CommandProps) {
  const [query, setQuery] = React.useState("");

  const normalized = query.trim().toLowerCase();

  const filteredGroups = React.useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.label.toLowerCase().includes(normalized),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [groups, normalized],
  );

  return (
    <div
      {...props}
      style={{
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: `${css.layout.space.md} 14px`,
          borderBottom: `1px solid ${css.divider}`,
        }}
      >
        <SearchIcon style={{ color: textSecondary, fontSize: "18px" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "none",
            fontFamily: "inherit",
            fontSize: "14px",
            color: textPrimary,
          }}
        />
      </div>
      <div style={{ padding: css.layout.space.sm }}>
        {filteredGroups.length === 0 && (
          <div
            style={{
              padding: `20px ${css.layout.space.md}`,
              textAlign: "center",
              fontSize: "13px",
              color: textSecondary,
            }}
          >
            No matching commands.
          </div>
        )}
        {filteredGroups.map((group) => (
          <div key={group.heading} style={{ marginBottom: "6px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: textSecondary,
                padding: `${css.layout.space.sm} 10px ${css.layout.space.xs}`,
              }}
            >
              {group.heading}
            </div>
            {group.items.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => item.onSelect?.()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "9px 10px",
                  borderRadius: css.radius.sm,
                  fontSize: "14px",
                  color: textPrimary,
                  fontFamily: "inherit",
                  transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
                }}
              >
                {item.icon && (
                  <span style={{ color: css.colors.primary }}>{item.icon}</span>
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
