import { Sidebar } from "./sidebar";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Sidebar header/footer/children slot; dimensi milik kit.
export function sidebarContractChecks() {
  const ok = (
    <Sidebar header={<div>Menu</div>} footer={<div>v1</div>}>
      <div>Item 1</div>
    </Sidebar>
  );
  const okBare = <Sidebar>polos</Sidebar>;

  // @ts-expect-error - style milik kit
  const noStyle = <Sidebar style={{ width: "300px" }}>x</Sidebar>;
  // @ts-expect-error - className milik kit
  const noClassName = <Sidebar className="nav">x</Sidebar>;
  // @ts-expect-error - onClick bukan kontrak Sidebar
  const noOnClick = <Sidebar onClick={() => {}}>x</Sidebar>;
  return { ok, okBare, noStyle, noClassName, noOnClick };
}
