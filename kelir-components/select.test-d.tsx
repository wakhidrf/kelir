import { Select } from "./select";

const OPTIONS = [
  { label: "Kentang", value: "kentang" },
  { label: "Bayam", value: "bayam" },
];

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Options label/value string; onChange semantik (string).
export function selectContractChecks() {
  const ok = (
    <Select
      options={OPTIONS}
      value="bayam"
      onChange={(v: string) => console.log(v)}
      label="Sayur"
      placeholder="Pilih sayur"
      id="s"
      aria-label="sayur"
    />
  );
  const okUncontrolled = (
    <Select options={OPTIONS} defaultValue="kentang" disabled />
  );

  // @ts-expect-error — style passthrough haram
  const noStyle = <Select options={OPTIONS} style={{ width: 200 }} />;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Select options={OPTIONS} sx={{ m: 1 }} />;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Select options={OPTIONS} className="my-select" />;
  // @ts-expect-error — MenuProps MUI haram (menu milik kit)
  const noMenuProps = <Select options={OPTIONS} MenuProps={{}} />;
  // @ts-expect-error — onChange event mentah haram (kontrak: string)
  const noRawOnChange = <Select options={OPTIONS} onChange={(e: { target: { value: string } }) => e} />;
  // @ts-expect-error — option value non-string haram
  const noRawOption = <Select options={[{ label: "X", value: 1 }]} />;
  // @ts-expect-error — multiple MUI haram (single-select milik kit)
  const noMultiple = <Select options={OPTIONS} multiple />;
  // @ts-expect-error — prop tak dikenal tidak diteruskan ke DOM
  const noRest = <Select options={OPTIONS} title="x" />;

  return { ok, okUncontrolled, noStyle, noSx, noClassName, noMenuProps, noRawOnChange, noRawOption, noMultiple, noRest };
}
