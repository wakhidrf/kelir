import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { CalendarProps } from "../types.js";
import { Calendar as NeumorphismCalendar } from "../themes/neumorphism/calendar.js";

export function Calendar(props: CalendarProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCalendar {...props} />;
  }

  return null;
}
