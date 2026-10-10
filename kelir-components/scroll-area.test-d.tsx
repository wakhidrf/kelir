import { ScrollArea } from "./scroll-area";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// ScrollArea: maxHeight PERILAKU + children slot.
export function scrollAreaContractChecks() {
  const ok = (
    <ScrollArea maxHeight={120}>
      <p>Isi</p>
    </ScrollArea>
  );

  const noStyle = (
    <ScrollArea
      maxHeight={120}
      // @ts-expect-error - style milik kit
      style={{ padding: 12 }}
    >
      <p>Isi</p>
    </ScrollArea>
  );
  const noClassName = (
    <ScrollArea
      maxHeight={120}
      // @ts-expect-error - className milik kit
      className="area"
    >
      <p>Isi</p>
    </ScrollArea>
  );
  return { ok, noStyle, noClassName };
}
