import { Button } from "./button";
import { Tooltip } from "./tooltip";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Tooltip title TEKS; visual tooltip milik kit (tanpa slotProps merge).
export function tooltipContractChecks() {
  const ok = (
    <Tooltip title="Info tambahan">
      <Button variant="secondary">Hover Me</Button>
    </Tooltip>
  );

  const noNodeTitle = (
    <Tooltip
      // @ts-expect-error - title non-string bukan kontrak Tooltip
      title={<b>tebal</b>}
    >
      <button type="button">x</button>
    </Tooltip>
  );
  const noSlotProps = (
    <Tooltip
      title="x"
      // @ts-expect-error - slotProps milik kit
      slotProps={{ tooltip: { style: { color: "red" } } }}
    >
      <button type="button">x</button>
    </Tooltip>
  );
  const noStyle = (
    <Tooltip
      title="x"
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    >
      <button type="button">x</button>
    </Tooltip>
  );
  return { ok, noNodeTitle, noSlotProps, noStyle };
}
