import { LoadingOverlay } from "./loading-overlay";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// open wajib; label/progress TEKS; children slot media. Tanpa onClose.
export function loadingOverlayContractChecks() {
  const ok = (
    <LoadingOverlay open label="Memuat" progress="3/9" id="lo" aria-label="memuat" />
  );
  const okMedia = <LoadingOverlay open>{"animasi"}</LoadingOverlay>;

  // @ts-expect-error - open wajib (overlay tak boleh muncul implisit)
  const noOpen = <LoadingOverlay label="Memuat" />;
  // @ts-expect-error - open boolean, bukan string
  const openString = <LoadingOverlay open="true" />;
  // @ts-expect-error - style passthrough haram
  const noStyle = <LoadingOverlay open style={{ margin: 4 }} />;
  // @ts-expect-error - sx passthrough haram
  const noSx = <LoadingOverlay open sx={{ m: 1 }} />;
  // @ts-expect-error - className passthrough haram
  const noClassName = <LoadingOverlay open className="my-overlay" />;
  // @ts-expect-error - onClose haram (pemuatan tak bisa di-dismiss)
  const noOnClose = <LoadingOverlay open onClose={() => {}} />;
  // @ts-expect-error - title haram (bukan dialog konfirmasi)
  const noTitle = <LoadingOverlay open title="Hapus?" />;

  return { ok, okMedia, noOpen, openString, noStyle, noSx, noClassName, noOnClose, noTitle };
}
