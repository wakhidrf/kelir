import { Menubar } from "./menubar";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Menubar: menus MenubarMenu[] (trigger TEKS + items).
export function menubarContractChecks() {
  const ok = (
    <Menubar menus={[{ trigger: "Berkas", items: [{ label: "Buka" }] }]} />
  );

  const noBadMenu = (
    <Menubar
      menus={[
        {
          trigger: "Berkas",
          items: [
            // @ts-expect-error - item tanpa label bukan kontrak MenubarItem
            {
              onClick: () => {},
            },
          ],
        },
      ]}
    />
  );
  const noStyle = (
    <Menubar
      menus={[{ trigger: "Berkas", items: [{ label: "Buka" }] }]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noBadMenu, noStyle };
}
