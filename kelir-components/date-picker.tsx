"use client";

import MuiPopover from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import type { DatePickerProps } from "../kelir-types";
import { css } from "../kelir-variants";

const convexShadow = css.shadows.convex;
const concaveShadow = css.shadows.concave;
const neumorphicBg = css.colors.surface;
const surfaceBlur = css.motion.blur.backdrop;
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
  const popoverZIndex = useTheme().zIndex.modal + 1;
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
    // Tangkap target secara sinkron: pembacaan properti event di dalam
    // updater tidak andal karena updater dieksekusi belakangan (setViewDate
    // di atas sudah mengantre render hingga evaluasi eager dilewati).
    const target = e.currentTarget;
    setViewDate(value ?? new Date());
    setPickerMode("days");
    setAnchorEl((prev) => (prev ? null : target));
  };

  const closeCalendar = () => {
    setAnchorEl(null);
    setPickerMode("days");
  };

  const handleSelect = (day: number) => {
    onChange?.(new Date(year, month, day));
    setAnchorEl(null);
  };

  const changeMonth = (delta: number) => {
    setViewDate(new Date(year, month + delta, 1));
  };

  const setMonthYear = (newMonth: number, newYear: number) => {
    setViewDate(new Date(newYear, newMonth, 1));
  };

  // Pilihan tahun: 30 tahun ke belakang hingga 30 tahun ke depan.
  const thisYear = today.getFullYear();
  const yearOptions = Array.from({ length: 61 }, (_, i) => thisYear - 30 + i);

  // Tampilan kalender: hari, grid bulan, atau daftar tahun — semuanya inline
  // di dalam satu popover agar tidak ada menu bertumpuk (masalah z-index).
  const [pickerMode, setPickerMode] = React.useState<
    "days" | "months" | "years"
  >("days");
  const yearsListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (pickerMode === "years" && yearsListRef.current) {
      const container = yearsListRef.current;
      const selected = container.querySelector("[data-selected='true']");
      if (selected instanceof HTMLElement) {
        container.scrollTop =
          selected.offsetTop -
          container.clientHeight / 2 +
          selected.clientHeight / 2;
      }
    }
  }, [pickerMode]);

  const modeButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: css.radius.sm,
    color: textPrimary,
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: 700,
    padding: "4px 8px",
    cursor: "pointer",
  };

  const optionButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "8px 4px",
    borderRadius: css.radius.sm,
    border: "1px solid transparent",
    backgroundColor: isSelected ? css.colors.primary : "transparent",
    color: isSelected ? css.on.primary : textPrimary,
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: isSelected ? 700 : 400,
    cursor: "pointer",
  });

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
      transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
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
          transition: `all ${css.motion.duration.hover} ${css.motion.easing.curve}`,
        }}
      >
        {value ? formatDate(value) : placeholder || "Select date"}
      </button>
      <MuiPopover
        open={open}
        anchorEl={anchorEl}
        onClose={closeCalendar}
        style={{ zIndex: popoverZIndex }}
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
            padding: css.layout.space.md,
            backgroundColor: neumorphicBg,
            borderRadius: css.radius.sm,
            boxShadow: convexShadow,
            border: `1px solid ${css.border.light}`,
            backdropFilter: surfaceBlur,
            WebkitBackdropFilter: surfaceBlur,
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
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <button
                type="button"
                aria-label="Choose month"
                onClick={() =>
                  setPickerMode((m) => (m === "months" ? "days" : "months"))
                }
                style={modeButtonStyle}
              >
                {MONTHS[month]} &#9662;
              </button>
              <button
                type="button"
                aria-label="Choose year"
                onClick={() =>
                  setPickerMode((m) => (m === "years" ? "days" : "years"))
                }
                style={modeButtonStyle}
              >
                {year} &#9662;
              </button>
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
          {pickerMode === "days" ? (
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
          ) : pickerMode === "months" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: css.layout.space.xs,
              }}
            >
              {MONTHS.map((name, index) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setMonthYear(index, year);
                    setPickerMode("days");
                  }}
                  style={optionButtonStyle(index === month)}
                >
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>
          ) : (
            <div
              ref={yearsListRef}
              style={{
                maxHeight: "210px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {yearOptions.map((y) => (
                <button
                  key={y}
                  type="button"
                  data-selected={y === year}
                  onClick={() => {
                    setMonthYear(month, y);
                    setPickerMode("days");
                  }}
                  style={optionButtonStyle(y === year)}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      </MuiPopover>
    </div>
  );
}
