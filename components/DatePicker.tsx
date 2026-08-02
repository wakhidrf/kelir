import * as React from "react";
import { useKelir } from "../KelirProvider.js";
import { DatePickerProps } from "../types.js";
import { DatePicker as NeumorphismDatePicker } from "../themes/neumorphism/date-picker.js";

export function DatePicker(props: DatePickerProps) {
  const { theme } = useKelir();

  if (theme === "neumorphism") {
    return <NeumorphismDatePicker {...props} />;
  }

  return null;
}
