import { Checkbox } from "./checkbox";

// Type-test negatif (Gel.2 §6/§6b): onChange boolean; label string.
export function checkboxContractChecks() {
  const ok = (
    <Checkbox label="Setuju" onChange={(v: boolean) => console.log(v)} id="c" />
  );

  // @ts-expect-error — onChange event mentah haram (kontrak: boolean)
  const noRawOnChange = <Checkbox onChange={(e: { target: { checked: boolean } }) => e} />;
  // @ts-expect-error — label non-string haram
  const noNodeLabel = <Checkbox label={<span>x</span>} />;
  // @ts-expect-error — style passthrough haram
  const noStyle = <Checkbox style={{}} />;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Checkbox sx={{}} />;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Checkbox className="x" />;

  return { ok, noRawOnChange, noNodeLabel, noStyle, noSx, noClassName };
}
