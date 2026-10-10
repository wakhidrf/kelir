import { Collapsible } from "./collapsible";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Collapsible: trigger TEKS + open TERKONTROL + onOpenChange boolean.
export function collapsibleContractChecks() {
  const ok = (
    <Collapsible trigger="Detail">
      <p>Isi</p>
    </Collapsible>
  );

  const noNodeTrigger = (
    <Collapsible
      // @ts-expect-error - trigger node bukan kontrak Collapsible (pakai string)
      trigger={<button type="button">Detail</button>}
    >
      <p>Isi</p>
    </Collapsible>
  );
  const noEventChange = (
    <Collapsible
      trigger="Detail"
      // @ts-expect-error - onOpenChange event haram (pakai boolean)
      onOpenChange={(_e: unknown, _x: unknown) => {}}
    >
      <p>Isi</p>
    </Collapsible>
  );
  const noStyle = (
    <Collapsible
      trigger="Detail"
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    >
      <p>Isi</p>
    </Collapsible>
  );
  return { ok, noNodeTrigger, noEventChange, noStyle };
}
