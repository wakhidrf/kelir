"use client";

import * as React from "react";
import { MONTHS } from "./date-picker-constants";
import { getModeButtonStyle, getNavButtonStyle } from "./date-picker-styles";

export function CalendarHeader({
  pickerMode,
  setPickerMode,
  year,
  month,
  onChangeMonth,
}: {
  pickerMode: "days" | "months" | "years";
  setPickerMode: React.Dispatch<React.SetStateAction<"days" | "months" | "years">>;
  year: number;
  month: number;
  onChangeMonth: (delta: number) => void;
}) {
  const modeButtonStyle = getModeButtonStyle();
  const navButtonStyle = getNavButtonStyle();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <button
        type="button"
        aria-label="Previous month"
        onClick={() => onChangeMonth(-1)}
        style={navButtonStyle}
      >
        ‹
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        <button
          type="button"
          aria-label="Choose month"
          onClick={() =>
            setPickerMode((m) => (m === "months" ? "days" : "months"))
          }
          style={modeButtonStyle}
        >
          {MONTHS[month]} ▾
        </button>
        <button
          type="button"
          aria-label="Choose year"
          onClick={() =>
            setPickerMode((m) => (m === "years" ? "days" : "years"))
          }
          style={modeButtonStyle}
        >
          {year} ▾
        </button>
      </div>
      <button
        type="button"
        aria-label="Next month"
        onClick={() => onChangeMonth(1)}
        style={navButtonStyle}
      >
        ›
      </button>
    </div>
  );
}