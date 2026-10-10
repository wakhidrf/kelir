import { Button } from "./button";
import { Popover } from "./popover";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Popover trigger slot; open terkontrol-penuh; onClose tanpa event.
export function popoverContractChecks() {
  const ok = (
    <Popover trigger={<Button variant="outline">Open</Button>}>
      <div>Isi</div>
    </Popover>
  );
  const okControlled = (
    <Popover
      trigger={<Button variant="outline">Open</Button>}
      open
      onClose={() => {}}
    >
      <div>Isi</div>
    </Popover>
  );

  const noEventClose = (
    <Popover
      trigger={<Button variant="outline">Open</Button>}
      // @ts-expect-error - onClose event MUI haram (tanpa argumen)
      onClose={(_e: unknown, _r: unknown) => {}}
    >
      <div>Isi</div>
    </Popover>
  );
  const noAnchor = (
    <Popover
      trigger={<Button variant="outline">Open</Button>}
      // @ts-expect-error - anchorEl milik kit (dari trigger)
      anchorEl={null}
    >
      <div>Isi</div>
    </Popover>
  );
  const noStyle = (
    <Popover
      trigger={<Button variant="outline">Open</Button>}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    >
      <div>Isi</div>
    </Popover>
  );
  return { ok, okControlled, noEventClose, noAnchor, noStyle };
}
