import MuiPopover from "@mui/material/Popover";
import * as React from "react";
import type { DatePickerProps } from "../kelir-types";
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

export function DatePicker({
  value,
  onChange,
  placeholder,
  style,
  ...props
}: DatePickerProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [viewDate, setViewDate] = React.useState<Date>(value ?? new Date());

  const open = Boolean(anchorEl);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { key: string; day: number | null }[] = Array.from(
    { length: firstDay + daysInMonth },
    (_, index) => {
      const day = index - firstDay + 1;
      return {
        key: day > 0 ? `day-${day}` : `pad-${index}`,
        day: day > 0 ? day : null,
      };
    },
  );

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const monthNumber = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${monthNumber}/${date.getFullYear()}`;
  };

  const openCalendar = (e: React.MouseEvent<HTMLButtonElement>) => {
    setViewDate(value ?? new Date());
    setAnchorEl((prev) => (prev ? null : e.currentTarget));
  };

  const handleSelect = (day: number) => {
    onChange?.(new Date(year, month, day));
    setAnchorEl(null);
  };

  const changeMonth = (delta: number) => {
    setViewDate(new Date(year, month + delta, 1));
  };

  const navButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    borderRadius: css.radius.sm,
    backgroundColor: neumorphicBg,
    border: `1px solid ${css.border.light}`,
    boxShadow: convexShadow,
    color: textPrimary,
    fontFamily: "inherit",
    fontSize: "16px",
    lineHeight: 1,
    cursor: "pointer",
  };

  const dayButtonStyle = (day: number): React.CSSProperties => {
    const selected =
      value &&
      value.getFullYear() === year &&
      value.getMonth() === month &&
      value.getDate() === day;
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "34px",
      height: "34px",
      margin: "0 auto",
      borderRadius: css.radius.sm,
      border: `1px solid ${isToday && !selected ? css.border.medium : "transparent"}`,
      backgroundColor: selected ? css.colors.primary : "transparent",
      color: selected ? css.on.primary : textPrimary,
      fontFamily: "inherit",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 120ms ease-out",
    };
  };

  return (
    <div
      {...props}
      style={{
        width: "100%",
        fontFamily: "inherit",
        ...style,
      }}
    >
      <button
        type="button"
        onClick={openCalendar}
        style={{
          width: "100%",
          textAlign: "left",
          backgroundColor: neumorphicBg,
          borderRadius: css.radius.sm,
          boxShadow: concaveShadow,
          border: `1px solid ${css.border.light}`,
          padding: "10px 14px",
          color: value ? textPrimary : textSecondary,
          fontFamily: "inherit",
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 150ms ease-out",
        }}
      >
        {value ? formatDate(value) : placeholder || "Select date"}
      </button>
      <MuiPopover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            style: { backgroundColor: "transparent", boxShadow: "none" },
          },
        }}
      >
        <div
          style={{
            width: "280px",
            padding: "12px",
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.sm,
            boxShadow: convexShadow,
            border: `1px solid ${css.border.light}`,
          }}
        >
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
              onClick={() => changeMonth(-1)}
              style={navButtonStyle}
            >
              &#8249;
            </button>
            <div
              style={{
                fontWeight: 600,
                color: textPrimary,
                fontFamily: "inherit",
                fontSize: "14px",
              }}
            >
              {MONTHS[month]} {year}
            </div>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => changeMonth(1)}
              style={navButtonStyle}
            >
              &#8250;
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
            }}
          >
            {WEEKDAYS.map((weekday) => (
              <div
                key={weekday}
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  color: textSecondary,
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
                  onClick={() => handleSelect(day)}
                  style={dayButtonStyle(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </MuiPopover>
    </div>
  );
}
