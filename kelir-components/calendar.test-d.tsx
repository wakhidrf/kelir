import { Calendar } from "./calendar";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Calendar: value Date TERKONTROL + onChange(date) semantik.
export function calendarContractChecks() {
  const ok = <Calendar value={new Date(2026, 9, 10)} />;

  // @ts-expect-error - value string bukan kontrak Calendar (pakai Date)
  const noStringValue = <Calendar value="2026-10-10" />;
  const noEventChange = (
    <Calendar
      // @ts-expect-error - onChange event haram (pakai Date)
      onChange={(_e: unknown, _x: unknown) => {}}
    />
  );
  const noStyle = (
    <Calendar
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noStringValue, noEventChange, noStyle };
}
