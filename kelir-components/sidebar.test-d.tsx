import { Sidebar } from "./sidebar";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Sidebar header/footer/children slot; mode/open responsif; dimensi milik kit.
export function sidebarContractChecks() {
  const ok = (
    <Sidebar header={<div>Menu</div>} footer={<div>v1</div>}>
      <div>Item 1</div>
    </Sidebar>
  );
  const okBare = <Sidebar>polos</Sidebar>;
  const okDocked = <Sidebar mode="docked" aria-label="Navigasi">x</Sidebar>;
  const okOverlay = (
    <Sidebar mode="overlay" open onOpenChange={() => {}}>
      x
    </Sidebar>
  );

  // @ts-expect-error - style milik kit
  const noStyle = <Sidebar style={{ width: "300px" }}>x</Sidebar>;
  // @ts-expect-error - className milik kit
  const noClassName = <Sidebar className="nav">x</Sidebar>;
  // @ts-expect-error - onClick bukan kontrak Sidebar
  const noOnClick = <Sidebar onClick={() => {}}>x</Sidebar>;
  // @ts-expect-error - mode di luar union
  const noMode = <Sidebar mode="rail">x</Sidebar>;
  return { ok, okBare, okDocked, okOverlay, noStyle, noClassName, noOnClick, noMode };
}
