"use client";

import { css } from "../kelir-kit/kit-create-css";
import { MONTHS, navButtonStyles } from "./calendar-utils";

export function CalendarHeader({ year, month, onPrev, onNext }: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: css.layout.space.md,
      }}
    >
      <button type="button" aria-label="Previous month" onClick={onPrev} style={navButtonStyles}>
        ‹
      </button>
      <div style={{ fontWeight: 700, fontSize: "14px" }}>
        {MONTHS[month]} {year}
      </div>
      <button type="button" aria-label="Next month" onClick={onNext} style={navButtonStyles}>
        ›
      </button>
    </div>
  );
}