import { Toggle } from "./toggle";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Toggle model pressed (bukan selected MUI); children teks.
export function toggleContractChecks() {
  const ok = <Toggle pressed={false} onPressedChange={() => {}}>Auto Save</Toggle>;
  const okDefault = <Toggle defaultPressed>Notif</Toggle>;

  // @ts-expect-error - children non-string bukan kontrak Toggle
  const noNode = <Toggle>{<b>tebal</b>}</Toggle>;
  // @ts-expect-error - selected MUI haram (pakai pressed)
  const noSelected = <Toggle selected> x</Toggle>;
  // @ts-expect-error - value MUI haram (milik kit)
  const noValue = <Toggle value="v">x</Toggle>;
  // @ts-expect-error - onChange MUI haram (pakai onPressedChange)
  const noOnChange = <Toggle onChange={() => {}}>x</Toggle>;
  // @ts-expect-error - style milik kit
  const noStyle = <Toggle style={{ margin: 4 }}>x</Toggle>;
  return { ok, okDefault, noNode, noSelected, noValue, noOnChange, noStyle };
}
