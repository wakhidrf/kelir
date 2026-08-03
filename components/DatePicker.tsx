import * as React from "react";
import { useKelir } from "../KelirProvider";
import { DatePickerProps } from "../types";
import { DatePicker as NeumorphismDatePicker } from "../themes/neumorphism/date-picker";

export function DatePicker(props: DatePickerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDatePicker {...props} />;
  }

  return null;
}
