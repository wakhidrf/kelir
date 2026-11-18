"use client";

import { css } from "../kelir-variants";
import { WEEKDAYS } from "./date-picker-constants";
import { getDayButtonStyle } from "./date-picker-styles";

export function DaysView({
  cells,
  value,
  year,
  month,
  today,
  onSelectDay,
}: {
  cells: { key: string; day: number | null }[];
  value: Date | null;
  year: number;
  month: number;
  today: Date;
  onSelectDay: (day: number) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: css.layout.space.xs,
      }}
    >
      {WEEKDAYS.map((weekday) => (
        <div
          key={weekday}
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: css.colors.textSecondary,
            fontFamily: "inherit",
          }}
        >
          {weekday}
        </div>
      ))}
      {cells.map((cell) => {
        const day = cell.day;
        return day === null ? (
          <div key={cell.key} />
        ) : (
          <button
            key={cell.key}
            type="button"
            onClick={() => onSelectDay(day)}
            style={getDayButtonStyle(day, value, year, month, today)}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}