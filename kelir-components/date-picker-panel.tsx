"use client";

import * as React from "react";
import { css } from "../kelir-kit/kit-create-css";
import {
  CalendarHeader,
} from "./date-picker-header";
import { DaysView } from "./date-picker-days";
import { MonthsView, YearsView } from "./date-picker-months-years";
import {
  convexShadow,
  neumorphicBg,
} from "./date-picker-constants";

const surfaceBlur = css.motion.blur.backdrop;

export function DatePickerPanel({
  pickerMode,
  setPickerMode,
  year,
  month,
  value,
  today,
  cells,
  yearOptions,
  yearsListRef,
  onSelectDay,
  onChangeMonth,
  onSetMonthYear,
}: {
  pickerMode: "days" | "months" | "years";
  setPickerMode: React.Dispatch<React.SetStateAction<"days" | "months" | "years">>;
  year: number;
  month: number;
  value: Date | null;
  today: Date;
  cells: { key: string; day: number | null }[];
  yearOptions: number[];
  yearsListRef: React.RefObject<HTMLDivElement | null>;
  onSelectDay: (day: number) => void;
  onChangeMonth: (delta: number) => void;
  onSetMonthYear: (month: number, year: number) => void;
}) {
  return (
    <div
      style={{
        width: "280px",
        padding: css.layout.space.md,
        backgroundColor: neumorphicBg,
        borderRadius: css.radius.surface,
        boxShadow: convexShadow,
        border: `1px solid ${css.border.light}`,
        backdropFilter: surfaceBlur,
        WebkitBackdropFilter: surfaceBlur,
      }}
    >
      <CalendarHeader
        pickerMode={pickerMode}
        setPickerMode={setPickerMode}
        year={year}
        month={month}
        onChangeMonth={onChangeMonth}
      />
      {pickerMode === "days" ? (
        <DaysView
          cells={cells}
          value={value}
          year={year}
          month={month}
          today={today}
          onSelectDay={onSelectDay}
        />
      ) : pickerMode === "months" ? (
        <MonthsView
          year={year}
          month={month}
          onSetMonthYear={onSetMonthYear}
          setPickerMode={setPickerMode}
        />
      ) : (
        <YearsView
          year={year}
          month={month}
          yearOptions={yearOptions}
          yearsListRef={yearsListRef}
          onSetMonthYear={onSetMonthYear}
          setPickerMode={setPickerMode}
        />
      )}
    </div>
  );
}