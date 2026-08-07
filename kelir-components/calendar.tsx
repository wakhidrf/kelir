import * as React from "react";
import type { CalendarProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const textPrimary = css.colors.textPrimary;
const textSecondary = css.colors.textSecondary;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const navButtonStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30px",
  height: "30px",
  border: `1px solid ${css.border.light}`,
  borderRadius: css.radius.sm,
  backgroundColor: neumorphicBg,
  color: textPrimary,
  boxShadow: convexShadow,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "16px",
  transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function Calendar({ value, onChange, ...props }: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(() => value ?? new Date());

  React.useEffect(() => {
    if (value) setViewDate(new Date(value.getFullYear(), value.getMonth(), 1));
  }, [value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  return (
    <div
      {...props}
      style={{
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.sm,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        padding: css.layout.space.lg,
        color: textPrimary,
        fontFamily: "inherit",
        ...props.style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: css.layout.space.md,
        }}
      >
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          style={navButtonStyles}
        >
          ‹
        </button>
        <div style={{ fontWeight: 700, fontSize: "14px" }}>
          {MONTHS[month]} {year}
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          style={navButtonStyles}
        >
          ›
        </button>
      </div>
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
              onClick={() => onChange?.(date)}
              style={{
                gridColumnStart: day === 1 ? firstDayOffset + 1 : undefined,
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRadius: css.radius.sm,
                backgroundColor: isSelected
                  ? css.colors.primary
                  : "transparent",
                color: isSelected
                  ? css.on.primary
                  : isToday
                    ? css.colors.primary
                    : textPrimary,
                boxShadow: isSelected ? concaveShadow : "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: isToday || isSelected ? 700 : 400,
                fontFamily: "inherit",
                outline:
                  isToday && !isSelected
                    ? `1px solid ${css.colors.primary}`
                    : "none",
                transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
