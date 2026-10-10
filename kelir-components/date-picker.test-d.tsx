import { DatePicker } from "./date-picker";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// DatePicker: value Date + onChange(date?) + placeholder TEKS.
export function datePickerContractChecks() {
  const ok = <DatePicker value={new Date(2026, 9, 10)} placeholder="Pilih" />;

  // @ts-expect-error - value string bukan kontrak DatePicker (pakai Date)
  const noStringValue = <DatePicker value="2026-10-10" />;
  const noEventChange = (
    <DatePicker
      // @ts-expect-error - onChange event haram (pakai Date)
      onChange={(_e: unknown, _x: unknown) => {}}
    />
  );
  const noStyle = (
    <DatePicker
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noStringValue, noEventChange, noStyle };
}
