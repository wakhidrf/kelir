import { Button } from "./button";
import { Dialog } from "./dialog";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// `open` boolean + `onClose` semantik; title slot teks.
export function dialogContractChecks() {
  const ok = (
    <Dialog
      open
      onClose={() => {}}
      title="Hapus item?"
      actions={<Button variant="destructive">Hapus</Button>}
      id="d"
      aria-label="konfirmasi hapus"
    >
      Tindakan ini tidak dapat dibatalkan.
    </Dialog>
  );

  // @ts-expect-error — open wajib (boolean, bukan opsional)
  const noOpen = <Dialog onClose={() => {}}>isi</Dialog>;
  // @ts-expect-error — onClose event mentah haram (kontrak: () => void)
  const noRawOnClose = <Dialog open onClose={(e: object) => e}>isi</Dialog>;
  // @ts-expect-error — style passthrough haram
  const noStyle = <Dialog open onClose={() => {}} style={{ width: 500 }}>isi</Dialog>;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Dialog open onClose={() => {}} sx={{ m: 1 }}>isi</Dialog>;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Dialog open onClose={() => {}} className="my-dialog">isi</Dialog>;
  // @ts-expect-error — title non-string haram (slot teks = string)
  const noNodeTitle = <Dialog open onClose={() => {}} title={<span>x</span>}>isi</Dialog>;
  // @ts-expect-error — maxWidth MUI haram (ukuran milik kit)
  const noMuiProp = <Dialog open onClose={() => {}} maxWidth="lg">isi</Dialog>;

  return { ok, noOpen, noRawOnClose, noStyle, noSx, noClassName, noNodeTitle, noMuiProp };
}
