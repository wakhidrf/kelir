import { ContextMenu } from "./context-menu";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// ContextMenu: trigger TEKS + menuItems ContextMenuItem[].
export function contextMenuContractChecks() {
  const ok = (
    <ContextMenu trigger="Klik kanan" menuItems={[{ label: "Ganti" }]} />
  );

  const noNodeTrigger = (
    <ContextMenu
      // @ts-expect-error - trigger node bukan kontrak ContextMenu (pakai string)
      trigger={<div>Klik kanan</div>}
      menuItems={[{ label: "Ganti" }]}
    />
  );
  const noStyle = (
    <ContextMenu
      trigger="Klik kanan"
      menuItems={[{ label: "Ganti" }]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noNodeTrigger, noStyle };
}
