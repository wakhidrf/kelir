import { Direction } from "./direction";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Direction: dir MAKNA ltr|rtl + children slot.
export function directionContractChecks() {
  const ok = (
    <Direction dir="rtl">
      <p>Isi</p>
    </Direction>
  );

  const noBadDir = (
    <Direction
      // @ts-expect-error - dir di luar union bukan kontrak Direction
      dir="auto"
    >
      <p>Isi</p>
    </Direction>
  );
  const noStyle = (
    <Direction
      dir="ltr"
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    >
      <p>Isi</p>
    </Direction>
  );
  return { ok, noBadDir, noStyle };
}
