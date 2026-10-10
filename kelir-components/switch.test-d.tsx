import { Switch } from "./switch";

// Type-test negatif (Gel.2 §6/§6b): onChange boolean; label? string.
export function switchContractChecks() {
  const ok = <Switch defaultChecked onChange={(v: boolean) => console.log(v)} />;

  // @ts-expect-error — onChange event mentah haram (kontrak: boolean)
  const noRawOnChange = <Switch onChange={(e: { target: { checked: boolean } }) => e} />;
  // @ts-expect-error — label non-string haram
  const noNodeLabel = <Switch label={<span>x</span>} />;
  // @ts-expect-error — style passthrough haram
  const noStyle = <Switch style={{}} />;
  // @ts-expect-error — color MUI haram (warna milik kit)
  const noColor = <Switch color="secondary" />;

  return { ok, noRawOnChange, noNodeLabel, noStyle, noColor };
}
