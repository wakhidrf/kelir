"use client";

import * as React from "react";
import { css } from "../kelir-kit/kit-create-css";
import { MONTHS } from "./date-picker-constants";
import { getOptionButtonStyle } from "./date-picker-styles";

export function MonthsView({
  year,
  month,
  onSetMonthYear,
  setPickerMode,
}: {
  year: number;
  month: number;
  onSetMonthYear: (month: number, year: number) => void;
  setPickerMode: React.Dispatch<React.SetStateAction<"days" | "months" | "years">>;
}) {
  return (
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
            onSetMonthYear(index, year);
            setPickerMode("days");
          }}
          style={getOptionButtonStyle(index === month)}
        >
          {name.slice(0, 3)}
        </button>
      ))}
    </div>
  );
}

export function YearsView({
  year,
  month,
  yearOptions,
  yearsListRef,
  onSetMonthYear,
  setPickerMode,
}: {
  year: number;
  month: number;
  yearOptions: number[];
  yearsListRef: React.RefObject<HTMLDivElement | null>;
  onSetMonthYear: (month: number, year: number) => void;
  setPickerMode: React.Dispatch<React.SetStateAction<"days" | "months" | "years">>;
}) {
  return (
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
            onSetMonthYear(month, y);
            setPickerMode("days");
          }}
          style={getOptionButtonStyle(y === year)}
        >
          {y}
        </button>
      ))}
    </div>
  );
}