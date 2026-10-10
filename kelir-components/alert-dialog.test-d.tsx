import { AlertDialog } from "./alert-dialog";

// Type-test negatif (Gel.2 §6/§6b): open/title/description wajib string.
export function alertDialogContractChecks() {
  const ok = (
    <AlertDialog
      open
      title="Hapus?"
      description="Tidak dapat dibatalkan."
      onCancel={() => {}}
      onConfirm={() => {}}
    />
  );

  // @ts-expect-error — open wajib
  const noOpen = <AlertDialog title="x" description="y" />;
  // @ts-expect-error — title non-string haram
  const noNodeTitle = <AlertDialog open title={<span>x</span>} description="y" />;
  // @ts-expect-error — description non-string haram
  const noNodeDesc = <AlertDialog open title="x" description={<span>y</span>} />;
  // @ts-expect-error — style passthrough haram
  const noStyle = <AlertDialog open title="x" description="y" style={{}} />;
  // @ts-expect-error — disableScrollLock konsumen haram (milik kit)
  const noScrollLock = <AlertDialog open title="x" description="y" disableScrollLock={false} />;
  // @ts-expect-error — maxWidth MUI haram
  const noMui = <AlertDialog open title="x" description="y" maxWidth="lg" />;

  return { ok, noOpen, noNodeTitle, noNodeDesc, noStyle, noScrollLock, noMui };
}
