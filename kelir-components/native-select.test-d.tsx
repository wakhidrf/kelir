import { NativeSelect } from "./native-select";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// NativeSelect options + onChange semantik (string) + label slot teks.
export function nativeSelectContractChecks() {
  const ok = (
    <NativeSelect
      options={[{ label: "Indonesia", value: "id" }]}
      value="id"
      onChange={() => {}}
      label="Bahasa"
    />
  );

  const noEvent = (
    <NativeSelect
      options={[{ label: "A", value: "a" }]}
      // @ts-expect-error - onChange event haram (pakai string)
      onChange={(_e: unknown, _v: unknown) => {}}
    />
  );
  const noStyle = (
    <NativeSelect
      options={[{ label: "A", value: "a" }]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noEvent, noStyle };
}
