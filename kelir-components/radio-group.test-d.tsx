import { RadioGroup } from "./radio-group";

const OPTIONS = [
  { label: "A", value: "a" },
  { label: "B", value: "b" },
];

// Type-test negatif (Gel.2 §6/§6b): onChange string; opsi label/value.
export function radioGroupContractChecks() {
  const ok = (
    <RadioGroup options={OPTIONS} onChange={(v: string) => console.log(v)} />
  );

  // @ts-expect-error — onChange event mentah haram (kontrak: string)
  const noRawOnChange = <RadioGroup options={OPTIONS} onChange={(e: { target: { value: string } }) => e} />;
  // @ts-expect-error — option value non-string haram
  const noRawOption = <RadioGroup options={[{ label: "A", value: 1 }]} />;
  // @ts-expect-error — row MUI haram (susunan milik kit)
  const noRow = <RadioGroup options={OPTIONS} row />;
  // @ts-expect-error — style passthrough haram
  const noStyle = <RadioGroup options={OPTIONS} style={{}} />;

  return { ok, noRawOnChange, noRawOption, noRow, noStyle };
}
