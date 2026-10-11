import { Sidebar } from "./sidebar";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Sidebar header/footer/children slot; mode/open responsif; dimensi milik kit.
export function sidebarContractChecks() {
  const ok = (
    <Sidebar header={<div>Menu</div>} footer={<div>v1</div>} aria-label="Navigasi">
      <div>Item 1</div>
    </Sidebar>
  );
  const okBare = <Sidebar aria-label="Navigasi">polos</Sidebar>;
  const okDocked = <Sidebar mode="docked" aria-label="Navigasi">x</Sidebar>;
  const okOverlay = (
    <Sidebar mode="overlay" open onOpenChange={() => {}} aria-label="Navigasi">
      x
    </Sidebar>
  );
  const okTrigger = (
    <Sidebar mode="overlay" triggerVariant="hamburger" overlayHeight="auto" aria-label="Navigasi">
      x
    </Sidebar>
  );

  // @ts-expect-error - style milik kit
  const noStyle = <Sidebar style={{ width: "300px" }} aria-label="x">x</Sidebar>;
  // @ts-expect-error - className milik kit
  const noClassName = <Sidebar className="nav" aria-label="x">x</Sidebar>;
  // @ts-expect-error - onClick bukan kontrak Sidebar
  const noOnClick = <Sidebar onClick={() => {}} aria-label="x">x</Sidebar>;
  // @ts-expect-error - mode di luar union
  const noMode = <Sidebar mode="rail" aria-label="x">x</Sidebar>;
  // @ts-expect-error - triggerVariant di luar union
  const noTrigger = <Sidebar mode="overlay" triggerVariant="dots" aria-label="x">x</Sidebar>;
  // @ts-expect-error - overlayHeight di luar union
  const noHeight = <Sidebar mode="overlay" overlayHeight="half" aria-label="x">x</Sidebar>;
  // @ts-expect-error - aria-label wajib (landmark nav butuh nama)
  const noLabel = <Sidebar mode="docked">x</Sidebar>;
  return { ok, okBare, okDocked, okOverlay, okTrigger, noStyle, noClassName, noOnClick, noMode, noTrigger, noHeight, noLabel };
}
