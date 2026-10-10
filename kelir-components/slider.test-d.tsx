import { Slider } from "./slider";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Slider nilai tunggal; onChange semantik (number).
export function sliderContractChecks() {
  const ok = <Slider value={60} onChange={() => {}} />;
  const okRange = <Slider min={0} max={100} step={5} defaultValue={20} />;

  const noEvent = (
    <Slider
      // @ts-expect-error - onChange event MUI haram (pakai number)
      onChange={(_e: unknown, _v: unknown) => {}}
    />
  );
  // @ts-expect-error - style milik kit
  const noStyle = <Slider style={{ color: "red" }} />;
  return { ok, okRange, noEvent, noStyle };
}
