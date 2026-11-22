"use client";

import { css } from "../kelir-kit/kit-create-css";
import { WEEKDAYS, isSameDay } from "./calendar-utils";

const concaveShadow = css.shadows.concave;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

export function CalendarGrid({ year, month, value, today, onChange }: {
  year: number;
  month: number;
  value: Date | null;
  today: Date;
  onChange: (date: Date) => void;
}) {
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: css.layout.space.xs,
        textAlign: "center",
      }}
    >
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: textSecondary,
            padding: `${css.layout.space.xs} 0`,
          }}
        >
          {day}
        </div>
      ))}
      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
        const date = new Date(year, month, day);
        const isToday = isSameDay(date, today);
        const isSelected = value ? isSameDay(date, value) : false;
        return (
          <button
            key={day}
            type="button"
            onClick={() => onChange(date)}
            style={{
              gridColumnStart: day === 1 ? firstDayOffset + 1 : undefined,
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: css.radius.button,
              backgroundColor: isSelected ? css.colors.primary : "transparent",
              color: isSelected ? css.on.primary : isToday ? css.colors.primary : textPrimary,
              boxShadow: isSelected ? concaveShadow : "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: isToday || isSelected ? 700 : 400,
              fontFamily: "inherit",
              outline: isToday && !isSelected ? `1px solid ${css.colors.primary}` : "none",
              transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
            }}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}

export function CalendarContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: css.colors.surface,
        borderRadius: css.radius.card,
        boxShadow: css.shadows.convex,
        border: `1px solid ${css.border.light}`,
        padding: css.layout.space.lg,
        color: textPrimary,
        fontFamily: "inherit",
      }}
    >
      {children}
    </div>
  );
}