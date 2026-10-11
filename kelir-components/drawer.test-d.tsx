import { Drawer } from "./drawer";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Drawer open TERKONTROL PENUH (wajib); onClose tanpa event.
export function drawerContractChecks() {
  const ok = (
    <Drawer open title="Jadwal" onClose={() => {}}>
      <p>Isi</p>
    </Drawer>
  );

  // @ts-expect-error - open wajib (terkontrol penuh)
  const noOpen = <Drawer onClose={() => {}} />;
  // @ts-expect-error - onClose wajib
  const noOnClose = <Drawer open />;
  const noEventClose = (
    <Drawer
      open
      // @ts-expect-error - onClose event MUI haram (tanpa argumen)
      onClose={(_e: unknown, _r: unknown) => {}}
    />
  );
  // @ts-expect-error - title non-string bukan kontrak Drawer
  const noNodeTitle = <Drawer open onClose={() => {}} title={<b>T</b>} />;
  const noAnchor = (
    <Drawer
      open
      onClose={() => {}}
      // @ts-expect-error - anchor milik kit (kiri)
      anchor="right"
    />
  );
  const okAuto = (
    <Drawer open onClose={() => {}} height="auto">
      <p>Isi</p>
    </Drawer>
  );
  const noPaperHeight = (
    <Drawer
      open
      onClose={() => {}}
      // @ts-expect-error - height di luar union
      height="half"
    />
  );
  return { ok, noOpen, noOnClose, noEventClose, noNodeTitle, noAnchor, okAuto, noPaperHeight };
}
