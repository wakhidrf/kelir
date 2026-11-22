"use client";

import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import type { CommandProps } from "../kelir-kit/kit-navigation-chrome";
import { css } from "../kelir-kit/kit-create-css";
import { CommandGroupItems } from "./command-group";
import { filterCommandGroups } from "./command-model";

const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function Command({
  placeholder,
  groups,
}: CommandProps) {
  const [query, setQuery] = React.useState("");
  const filteredGroups = React.useMemo(
    () => filterCommandGroups(groups, query),
    [groups, query],
  );

  return (
    <div
      style={{
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.surface,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        color: textPrimary,
        fontFamily: "inherit",
        overflow: "hidden",
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
          // Kit-owned a11y: placeholder is not a label (axe label rule).
          aria-label={placeholder ?? "Search commands"}
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
          <CommandGroupItems key={group.heading} group={group} />
        ))}
      </div>
    </div>
  );
}
