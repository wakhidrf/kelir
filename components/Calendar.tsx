import * as React from "react";
import { useKelir } from "../KelirProvider";
import { CalendarProps } from "../types";
import { Calendar as NeumorphismCalendar } from "../themes/neumorphism/calendar";

export function Calendar(props: CalendarProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismCalendar {...props} />;
  }

  return null;
}
