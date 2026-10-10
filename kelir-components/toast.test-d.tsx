import { Button } from "./button";
import { Toast } from "./toast";

// Type-test negatif (Gel.2 §6/§6b): message string; open/onClose semantik.
export function toastContractChecks() {
  const ok = (
    <Toast
      message="Tersimpan"
      open
      onClose={() => {}}
      actionButton={<Button variant="ghost">Urungkan</Button>}
    />
  );

  // @ts-expect-error — open wajib
  const noOpen = <Toast message="x" onClose={() => {}} />;
  // @ts-expect-error — onClose wajib
  const noOnClose = <Toast message="x" open />;
  // @ts-expect-error — message non-string haram
  const noNodeMessage = <Toast message={<span>x</span>} open onClose={() => {}} />;
  // @ts-expect-error — style passthrough haram
  const noStyle = <Toast message="x" open onClose={() => {}} style={{}} />;
  // @ts-expect-error — anchorOrigin MUI haram (posisi milik kit)
  const noAnchor = <Toast message="x" open onClose={() => {}} anchorOrigin={{ vertical: "top", horizontal: "center" }} />;

  return { ok, noOpen, noOnClose, noNodeMessage, noStyle, noAnchor };
}
