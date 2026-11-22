import { css } from "../kelir-kit/kit-create-css";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
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

export function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const monthNumber = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${monthNumber}/${date.getFullYear()}`;
}

export function generateCells(
  year: number,
  month: number,
): { key: string; day: number | null }[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: firstDay + daysInMonth }, (_, index) => {
    const day = index - firstDay + 1;
    return {
      key: day > 0 ? `day-${day}` : `pad-${index}`,
      day: day > 0 ? day : null,
    };
  });
}

export function getYearOptions(thisYear: number): number[] {
  return Array.from({ length: 61 }, (_, i) => thisYear - 30 + i);
}

export const convexShadow = css.shadows.convex;
export const concaveShadow = css.shadows.concave;
export const neumorphicBg = css.colors.surface;
export const textPrimary = css.colors.textPrimary;
export const textSecondary = css.colors.textSecondary;