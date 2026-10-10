import { Combobox } from "./combobox";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Combobox: options string[] + value TERKONTROL + onChange(value) semantik.
export function comboboxContractChecks() {
  const ok = <Combobox label="Framework" options={["React", "Vue"]} />;

  // @ts-expect-error - options number[] bukan kontrak Combobox
  const noNumberOptions = <Combobox options={[1, 2]} />;
  const noEventChange = (
    <Combobox
      options={["React"]}
      // @ts-expect-error - onChange event MUI haram (pakai value)
      onChange={(_e: unknown, _v: unknown) => {}}
    />
  );
  const noMultiple = (
    <Combobox
      options={["React"]}
      // @ts-expect-error - multiple disengaja tidak ada (kelir-request)
      multiple
    />
  );
  const noStyle = (
    <Combobox
      options={["React"]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noNumberOptions, noEventChange, noMultiple, noStyle };
}
