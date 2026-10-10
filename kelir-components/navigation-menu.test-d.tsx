import { NavigationMenu } from "./navigation-menu";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// NavigationMenu: items NavigationMenuItem[] (label TEKS, onClick tanpa event).
export function navigationMenuContractChecks() {
  const ok = <NavigationMenu items={[{ label: "Dasbor", active: true }]} />;

  const noBadItem = (
    <NavigationMenu
      items={[
        // @ts-expect-error - item tanpa label bukan kontrak NavigationMenuItem
        {
          href: "/pesanan",
        },
      ]}
    />
  );
  const noEventClick = (
    <NavigationMenu
      items={[
        {
          label: "Dasbor",
          // @ts-expect-error - onClick event haram (tanpa argumen)
          onClick: (_e: unknown, _x: unknown) => {},
        },
      ]}
    />
  );
  const noStyle = (
    <NavigationMenu
      items={[{ label: "Dasbor" }]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noBadItem, noEventClick, noStyle };
}
