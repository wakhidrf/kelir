"use client";

import * as React from "react";
import type { CalendarProps } from "../kelir-kit/kit-forms-choice";
import { CalendarHeader } from "./calendar-header";
import { CalendarGrid, CalendarContainer } from "./calendar-grid";

export function Calendar({ value, onChange }: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(() => value ?? new Date());

  React.useEffect(() => {
    if (value) setViewDate(new Date(value.getFullYear(), value.getMonth(), 1));
  }, [value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();

  const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <CalendarContainer>
      <CalendarHeader year={year} month={month} onPrev={goToPrevMonth} onNext={goToNextMonth} />
      <CalendarGrid year={year} month={month} value={value ?? null} today={today} onChange={(d) => onChange?.(d)} />
    </CalendarContainer>
  );
}
