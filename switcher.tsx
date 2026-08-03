import * as React from "react";
import { useKelir } from "./KelirProvider";

export function KelirSwitcher() {
  const { theme, setTheme, font, setFont, themes, fonts } = useKelir();

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      padding: "8px 16px",
      borderRadius: "14px",
      backgroundColor: "var(--color-surface, #E8E8E8)",
      boxShadow: "var(--shadow-convex, 5px 5px 15px rgba(0, 0, 0, 0.08), -5px -5px 15px rgba(255, 255, 255, 0.9))",
      border: "1px solid rgba(255, 255, 255, 0.4)",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--color-text-secondary, #666666)", textTransform: "uppercase" }}>
          Theme
        </span>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          style={{
            border: "none",
            background: "transparent",
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--color-text-primary, #333333)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {themes.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "1px", height: "24px", backgroundColor: "rgba(0,0,0,0.1)" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--color-text-secondary, #666666)", textTransform: "uppercase" }}>
          Font
        </span>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value as any)}
          style={{
            border: "none",
            background: "transparent",
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--color-text-primary, #333333)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {fonts.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.family}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
