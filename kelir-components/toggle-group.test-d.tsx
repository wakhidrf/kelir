import { ToggleGroup } from "./toggle-group";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// ToggleGroup exclusive hardcode; onChange semantik (string).
export function toggleGroupContractChecks() {
  const ok = (
    <ToggleGroup
      options={[
        { label: "Bold", value: "bold" },
        { label: "Italic", value: "italic" },
      ]}
      value="bold"
      onChange={() => {}}
    />
  );
  const okDefault = (
    <ToggleGroup options={[{ label: "B", value: "b" }]} defaultValue="b" />
  );

  const noEvent = (
    <ToggleGroup
      options={[{ label: "B", value: "b" }]}
      // @ts-expect-error - onChange event MUI haram (pakai string)
      onChange={(_e: unknown, _v: unknown) => {}}
    />
  );
  const noExclusive = (
    <ToggleGroup
      options={[{ label: "B", value: "b" }]}
      // @ts-expect-error - exclusive milik kit (hardcode true)
      exclusive={false}
    />
  );
  const noStyle = (
    <ToggleGroup
      options={[{ label: "B", value: "b" }]}
      // @ts-expect-error - style milik kit
      style={{ gap: "4px" }}
    />
  );

  const okJoined = (
    <ToggleGroup
      options={[{ label: "ID", value: "id" }]}
      variant="joined"
      onChange={() => {}}
    />
  );
  const noUnknownVariant = (
    <ToggleGroup
      options={[{ label: "ID", value: "id" }]}
      // @ts-expect-error - variant hanya separated|joined
      variant="pill"
    />
  );
  return { ok, okDefault, noEvent, noExclusive, noStyle, okJoined, noUnknownVariant };
}
