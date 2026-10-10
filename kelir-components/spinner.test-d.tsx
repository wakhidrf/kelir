import { Spinner } from "./spinner";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Size union tertutup → px milik kit.
export function spinnerContractChecks() {
  const ok = <Spinner size="large" id="s" aria-label="memuat" />;

  // @ts-expect-error — style passthrough haram
  const noStyle = <Spinner style={{ margin: 4 }} />;
  // @ts-expect-error — sx passthrough haram
  const noSx = <Spinner sx={{ m: 1 }} />;
  // @ts-expect-error — className passthrough haram
  const noClassName = <Spinner className="my-spinner" />;
  // @ts-expect-error — size angka bebas haram (union tertutup)
  const noRawSize = <Spinner size={32} />;
  // @ts-expect-error — variant MUI haram (indeterminate milik kit)
  const noVariant = <Spinner variant="determinate" />;
  // @ts-expect-error — value MUI haram (tak ada progres determinate)
  const noValue = <Spinner value={50} />;

  return { ok, noStyle, noSx, noClassName, noRawSize, noVariant, noValue };
}
