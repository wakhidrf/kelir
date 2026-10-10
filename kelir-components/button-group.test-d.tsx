import { Button } from "./button";
import { ButtonGroup } from "./button-group";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// ButtonGroup = grup tombol Kelir; disabled PERILAKU.
export function buttonGroupContractChecks() {
  const ok = (
    <ButtonGroup>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
    </ButtonGroup>
  );
  const okDisabled = (
    <ButtonGroup disabled aria-label="Pilih rentang">
      <Button variant="outline">Day</Button>
    </ButtonGroup>
  );

  // @ts-expect-error - style milik kit
  const noStyle = <ButtonGroup style={{ gap: "4px" }} />;
  // @ts-expect-error - orientation bukan kontrak (grup selalu horizontal milik kit)
  const noOrientation = <ButtonGroup orientation="vertical" />;
  // @ts-expect-error - variant MUI bukan kontrak ButtonGroup
  const noVariant = <ButtonGroup variant="contained" />;
  return { ok, okDisabled, noStyle, noOrientation, noVariant };
}
