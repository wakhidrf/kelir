"use client";

import MuiPopover from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import type { DatePickerProps } from "../kelir-types";
import {
  generateCells,
  getYearOptions,
} from "./date-picker-constants";
import { DatePickerTrigger } from "./date-picker-trigger";
import { DatePickerPanel } from "./date-picker-panel";

export function DatePicker({
  value,
  onChange,
  placeholder,
}: DatePickerProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [viewDate, setViewDate] = React.useState<Date>(value ?? new Date());
  const [pickerMode, setPickerMode] = React.useState<"days" | "months" | "years">("days");
  const yearsListRef = React.useRef<HTMLDivElement>(null);

  const open = Boolean(anchorEl);
  const popoverZIndex = useTheme().zIndex.modal + 1;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();
  const thisYear = today.getFullYear();
  const cells = generateCells(year, month);
  const yearOptions = getYearOptions(thisYear);

  React.useEffect(() => {
    if (pickerMode === "years" && yearsListRef.current) {
      const container = yearsListRef.current;
      const selected = container.querySelector("[data-selected='true']");
      if (selected instanceof HTMLElement) {
        container.scrollTop =
          selected.offsetTop - container.clientHeight / 2 + selected.clientHeight / 2;
      }
    }
  }, [pickerMode]);

  const openCalendar = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  return (
    <div style={{ width: "100%", fontFamily: "inherit" }}>
      <DatePickerTrigger value={value ?? null} placeholder={placeholder} onOpen={openCalendar} />
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
        <DatePickerPanel
          pickerMode={pickerMode}
          setPickerMode={setPickerMode}
          year={year}
          month={month}
          value={value ?? null}
          today={today}
          cells={cells}
          yearOptions={yearOptions}
          yearsListRef={yearsListRef}
          onSelectDay={handleSelect}
          onChangeMonth={changeMonth}
          onSetMonthYear={setMonthYear}
        />
      </MuiPopover>
    </div>
  );
}