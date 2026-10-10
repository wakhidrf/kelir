import { Sheet } from "./sheet";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Sheet = Drawer bawah (anchor bottom hardcode, kontrak mandiri).
export function sheetContractChecks() {
  const ok = (
    <Sheet open title="Detail" onClose={() => {}}>
      <p>Isi</p>
    </Sheet>
  );

  // @ts-expect-error - open wajib
  const noOpen = <Sheet onClose={() => {}} />;
  const noEventClose = (
    <Sheet
      open
      // @ts-expect-error - onClose event MUI haram
      onClose={(_e: unknown, _r: unknown) => {}}
    />
  );
  const noAnchor = (
    <Sheet
      open
      onClose={() => {}}
      // @ts-expect-error - anchor milik kit (bottom)
      anchor="left"
    />
  );
  const noStyle = (
    <Sheet
      open
      onClose={() => {}}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noOpen, noEventClose, noAnchor, noStyle };
}
