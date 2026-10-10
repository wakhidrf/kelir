import { Tabs } from "./tabs";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Tabs value/defaultValue/onChange(string) semantik.
export function tabsContractChecks() {
  const ok = (
    <Tabs
      items={[{ label: "Overview", value: "a", content: "Isi a" }]}
      defaultValue="a"
    />
  );
  const okControlled = (
    <Tabs
      items={[{ label: "A", value: "a", content: null }]}
      value="a"
      onChange={() => {}}
    />
  );

  const noEvent = (
    <Tabs
      items={[{ label: "A", value: "a", content: null }]}
      // @ts-expect-error - onChange event MUI haram (pakai string)
      onChange={(_e: unknown, _v: unknown) => {}}
    />
  );
  const noStyle = (
    <Tabs
      items={[{ label: "A", value: "a", content: null }]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  // @ts-expect-error - items tanpa value
  const noValue = <Tabs items={[{ label: "A", content: null }]} />;
  return { ok, okControlled, noEvent, noStyle, noValue };
}
