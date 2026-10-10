import { Progress } from "./progress";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Progress value 0–100 + variant MAKNA.
export function progressContractChecks() {
  const ok = <Progress value={65} />;
  const okBusy = <Progress variant="indeterminate" />;

  // @ts-expect-error - color MUI haram (bar milik kit)
  const noColor = <Progress value={50} color="secondary" />;
  // @ts-expect-error - variant di luar union
  const noVariant = <Progress variant="buffer" />;
  // @ts-expect-error - style milik kit
  const noStyle = <Progress style={{ height: "20px" }} />;
  return { ok, okBusy, noColor, noVariant, noStyle };
}
